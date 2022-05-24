// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  IconButton,
  RangeSlider,
  ToolTip,
  SingleSlider,
} from "components/interface";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import {
  lightningChart,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  FontSettings,
  emptyLine,
  AxisTickStrategies,
  NumericTickStrategy,
  LineSeries,
} from "@arction/lcjs";
import savitzkyGolay from "ml-savitzky-golay";
import { useWindowSize } from "hooks";
import "./_styling/lineChart.css";

const SLOPE_COMPUTE_INTERVAL = 1000; // milliseconds
const colors: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

interface LineChartProps {
  sensors: Sensor[];
  stream: Stream;
}

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
  const size = useWindowSize();

  // Stream subscriptions
  const [dataSubId, setDataSubId] = useState<string>("");
  const dataCallbackRef = useRef<(data: any, timestamp: number) => void>(null);
  const [dataUpdateSubId, setDataUpdateSubId] = useState<string>("");
  const missingDataCallbackRef = useRef<() => void>(null);
  const [connectionSubId, setConnectionSubId] = useState<string>("");
  const connectionCallbackRef = useRef<() => void>(null);
  const [stopSubId, setStopSubId] = useState<string>("");
  const stopCallbackRef = useRef<() => void>(null);
  const [disconnectSubId, setDisconnectSubId] = useState<string>("");
  const disconnectCallbackRef = useRef<() => void>(null);

  // Control state
  const [connected, setConnected] = useState<boolean>(false);
  const [interval, setInterval] = useState<number[]>();
  const [window, setWindow] = useState<number>(
    Math.ceil((500 / getDataRate(props.sensors)) * 5) | 1
  );
  const [updateTimer, setUpdateTimer] = useState<number>(
    SLOPE_COMPUTE_INTERVAL
  );

  // Chart state
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [lineSeries, setLineSeries] = useState<{ [k: string]: LineSeries }>({});
  const [slopes, setSlopes] = useState<{ [k: string]: LineSeries }>({});
  const [lastValues, setLastValues] = useState<{
    [key: number]: { [k1: string]: number };
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors)
        last[sensor.smallId] = { value: 0, slope: 0 };
      return last;
    })()
  );

  useEffect(() => {
    setChart(getChart(chartId, [0, 7500]));
  }, []);

  useEffect(() => {
    if (!chart) return;
    initializeLineSeries();
    const smallIds = props.sensors.map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, smallIds));
    setStopSubId(props.stream.subscribeToStop(stopCallbackRef));
    setDataUpdateSubId(
      props.stream.subscribeToDataUpdate(missingDataCallbackRef)
    );
    setConnectionSubId(
      props.stream.subscribeToConnection(connectionCallbackRef)
    );
    setDisconnectSubId(
      props.stream.subscribeToDisconnection(disconnectCallbackRef)
    );
    return () => {
      try {
        chart && chart.dispose();
      } catch (e) {}
    };
  }, [chart]);

  useEffect(() => {
    for (const datum of props.stream.getHistoricalData()) {
      for (const sensor of props.sensors) {
        if (datum[sensor.smallId] && lineSeries[sensor.smallId]) {
          lineSeries[sensor.smallId].add({
            x: datum["ts"],
            y: datum[sensor.smallId],
          });
        }
      }
    }
  }, [lineSeries]);

  useEffect(() => {
    if (!chart) return;
    props.stream.unsubscribeFromSensors(dataSubId);
    initializeLineSeries();
    const smallIds = props.sensors.map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, smallIds));
  }, [props.sensors]);

  useEffect(() => {
    if (!chart || !interval) return;
    const C = 60 * 1000;
    const offset = props.stream.getFirstTimeStamp();
    chart.getDefaultAxisX().setInterval(
      interval[0] * C + offset,
      interval[1] * C + offset,
      false,
      !connected // Disable scrolling when disconnected
    );
  }, [interval, connected]);

  useEffect(() => {
    return () => {
      props.stream.unsubscribeFromConnection(connectionSubId);
      props.stream.unsubscribeFromStop(stopSubId);
      props.stream.unsubscribeFromDisconnection(disconnectSubId);
      props.stream.unsubscribeFromSensors(dataSubId);
      props.stream.unsubscribeFromDataUpdate(dataUpdateSubId);
    };
  }, [dataSubId, dataUpdateSubId]);

  useEffect(() => {
    // @ts-ignore
    dataCallbackRef.current = onData; // @ts-ignore
    missingDataCallbackRef.current = onUpdatedData; // @ts-ignore
    connectionCallbackRef.current = onConnection; // @ts-ignore
    stopCallbackRef.current = onStop; // @ts-ignore
    disconnectCallbackRef.current = onDisconnect;
  }, [lineSeries, lastValues, updateTimer, lineSeries, slopes, interval]);

  useEffect(() => {
    for (const sensor of props.sensors) {
      if (slopes[sensor.smallId]) {
        slopes[sensor.smallId].clear();
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window
        );
        slopes[sensor.smallId].add(slope);
      }
    }
  }, [window]);

  const initializeLineSeries = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.dispose();
    for (const [_, series] of Object.entries(slopes)) series.dispose();
    setLineSeries(generateLineSeries(chart, props.sensors));
    setSlopes({});
  };

  const generateLegend = useCallback(() => {
    if (!lastValues || lastValues === {}) return;
    let legendElements: any = [];
    const generateSensor = (name: string, value: number, unit: string) => (
      <div>
        {name + ": " + value.toFixed(2).replace(/[.,]00$/, "") + " " + unit}
      </div>
    );
    let i = 0;
    for (const sensor of props.sensors) {
      legendElements.push(
        <div
          key={sensor.smallId}
          className="sensor"
          style={{ color: colors[i] }}
        >
          <ToolTip value="Derivative">
            <IconButton
              text={"∂"}
              onClick={() => toggleSlope(sensor)}
              style={{
                backgroundColor: colors[i],
                textDecoration: slopes[sensor.smallId]
                  ? "line-through"
                  : "none",
              }}
            />
          </ToolTip>
          {generateSensor(
            sensor.name,
            lastValues[sensor.smallId]["value"],
            sensor.unit ? sensor.unit : ""
          )}
        </div>
      );
      if (slopes[sensor.smallId]) {
        legendElements.push(
          <div
            className="sensor slope"
            style={{ color: colors[i] + "80" }}
            key={sensor._id}
          >
            {generateSensor(
              sensor.name + "'",
              lastValues[sensor.smallId]["slope"],
              sensor.unit + (sensor.unit ? "/s" : "")
            )}
          </div>
        );
      }
      i++;
    }
    return legendElements;
  }, [chart, lastValues, lineSeries, slopes]);

  const toggleSlope = useCallback(
    (sensor: Sensor) => {
      let dxdts = { ...slopes };
      if (dxdts[sensor.smallId]) {
        dxdts[sensor.smallId].dispose();
        delete dxdts[sensor.smallId];
      } else {
        let sensorIndex = 0;
        for (const i in props.sensors)
          if (props.sensors[i].smallId === sensor.smallId)
            sensorIndex = Number(i);
        dxdts[sensor.smallId] = createSeries(
          chart,
          sensor.name + "'",
          sensor.unit,
          colors[sensorIndex] + "10"
        );
        dxdts[sensor.smallId].add(
          getSlope(props.stream.getHistoricalSensorData(sensor.smallId), window)
        );
      }
      setSlopes(dxdts);
    },
    [chart, slopes]
  );

  const onConnection = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.clear();
    setConnected(true);
  };

  const onStop = () => {
    setConnected(false);
  };

  const onDisconnect = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.clear();
    setConnected(false);
  };

  const onData = (data: { [key: string]: number }, timestamp: number) => {
    if (!data) return;
    let last = { ...lastValues };
    let updateTime = updateTimer - getDataRate(props.sensors);
    for (const sensor of props.sensors) {
      if (data[sensor.smallId] && lineSeries[sensor.smallId]) {
        lineSeries[sensor.smallId].add({
          x: timestamp,
          y: data[sensor.smallId],
        });
        last[sensor.smallId]["value"] = data[sensor.smallId];
      }
      if (slopes[sensor.smallId] && updateTime <= 0) {
        slopes[sensor.smallId].clear();
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window
        );
        last[sensor.smallId]["slope"] = slope[slope.length - 1].y;
        slopes[sensor.smallId].add(slope);
      }
    }
    setUpdateTimer(updateTime <= 0 ? SLOPE_COMPUTE_INTERVAL : updateTime);
    setLastValues(last);
    setConnected(true);
  };

  const onUpdatedData = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.clear();
    for (const datum of props.stream.getHistoricalData()) {
      for (const sensor of props.sensors) {
        if (datum[sensor.smallId]) {
          if (lineSeries[sensor.smallId])
            lineSeries[sensor.smallId].add({
              x: datum["ts"],
              y: datum[sensor.smallId],
            });
        }
      }
    }
    for (const sensor of props.sensors) {
      if (slopes[sensor.smallId]) {
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window
        );
        slopes[sensor.smallId].add(slope);
      }
    }
    // TODO: Set last values?
    setInterval(interval);
  };

  return (
    <div>
      <div
        className="line-legend"
        style={{
          gridTemplateColumns: (() => {
            let template = "1fr 1fr";
            let legendCount =
              Object.keys(lineSeries).length + Object.keys(slopes).length;
            if (size.width >= 1000 && legendCount >= 4)
              template = "1fr 1fr 1fr 1fr";
            if (size.width >= 1000 && legendCount % 3 === 0)
              template = "1fr 1fr 1fr";
            return template;
          })(),
        }}
      >
        {generateLegend()}
      </div>
      <div
        id={chartId.toString()}
        style={{ height: size.width >= 768.9 ? "320px" : "250px" }}
        className="fill"
      ></div>
      <div className="line-controls">
        <RangeSlider
          title="Interval (minutes)"
          min={0}
          max={120}
          marks={{ 0: 0, 60: 15, 120: 30 }}
          step={1}
          lowerValue={0}
          upperValue={1}
          unit="minutes"
          onChange={(interval: number[]) => {
            // @ts-ignore
            setInterval(interval.map((x) => x / 4));
          }}
        />
        {Object.keys(slopes).length > 0 && (
          <>
            <br />
            <SingleSlider
              title="Derivative Smoothing Factor"
              min={0}
              max={100}
              marks={{ 0: 0, 100: 100 }}
              step={2}
              default={5}
              unit="seconds"
              onChange={(w: number) =>
                setWindow(
                  Math.ceil((500 / getDataRate(props.sensors)) * (w + 5)) | 1
                )
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

const getChart = (chartId: number, interval: number[]) => {
  // Configure the base chart
  let chart = lightningChart()
    .ChartXY({
      container: document.getElementById(chartId.toString()) as HTMLDivElement,
    })
    .setTitle("")
    .setBackgroundFillStyle(theme.whiteFill)
    .setSeriesBackgroundFillStyle(theme.whiteFill)
    .setMouseInteractions(true)
    .setMouseInteractionWheelZoom(false)
    .setMouseInteractionPan(false)
    .setMouseInteractionRectangleFit(false)
    .setMouseInteractionRectangleZoom(false)
    .setMouseInteractionsWhileScrolling(false)
    .setMouseInteractionsWhileZooming(false);

  // Configure the auto-cursor
  let autoCursor = chart.getAutoCursor();
  autoCursor.setGridStrokeXStyle(
    new SolidLine({ thickness: 1, fillStyle: theme.redFill })
  );
  autoCursor.setGridStrokeYStyle(
    new SolidLine({ thickness: 1, fillStyle: theme.redFill })
  );
  autoCursor.getPointMarker().setSize({ x: 0, y: 0 });
  autoCursor.disposeTickMarkerX();
  autoCursor.disposeTickMarkerY();
  var font = new FontSettings({});
  font = font.setFamily("helvetica");
  font = font.setWeight("bold");
  autoCursor.getResultTable().setTextFont(font);
  autoCursor.getResultTable().setTextFillStyle(theme.whiteFill);
  autoCursor
    .getResultTable()
    .setBackground((background) => background.setFillStyle(theme.redFill));

  // Configure the axes
  chart
    .getDefaultAxisX()
    .setTitle("")
    .setScrollStrategy(AxisScrollStrategies.progressive)
    .setInterval(interval[0], interval[1])
    .setTickStrategy("Empty")
    .setMouseInteractions(false)
    .setStrokeStyle(
      new SolidLine({ thickness: 1, fillStyle: theme.lightGrayFill })
    );
  const tickStyling = (tickStyle: any) =>
    tickStyle
      .setGridStrokeStyle(emptyLine)
      .setLabelFont((font: FontSettings) =>
        font.setFamily("helvetica").setStyle("italic").setSize(8)
      )
      .setLabelFillStyle(theme.darkFill)
      .setLabelPadding(-10);
  chart
    .getDefaultAxisY()
    .setTitle("")
    .setScrollStrategy(AxisScrollStrategies.expansion)
    .setTickStrategy("Empty")
    .setMouseInteractions(false)
    .setStrokeStyle(
      new SolidLine({ thickness: 1, fillStyle: theme.lightGrayFill })
    )
    .setTickStrategy(
      AxisTickStrategies.Numeric,
      (strategy: NumericTickStrategy) =>
        strategy
          .setMajorTickStyle(tickStyling)
          .setMinorTickStyle(tickStyling)
          .setExtremeTickStyle(tickStyling)
    );

  // Allow scrolling while hovering over chart
  chart.engine.container.onwheel = null;
  return chart;
};

const generateLineSeries = (chart: any, sensors: Sensor[]) => {
  let lineSeries: any = {};
  let i = 0;
  for (const sensor of sensors) {
    lineSeries[sensor.smallId] = createSeries(
      chart,
      sensor.name,
      sensor.unit,
      colors[i]
    );
    i++;
  }
  return lineSeries;
};

const createSeries = (
  chart: any,
  name: string,
  unit: string | undefined,
  color: string
) => {
  let series: LineSeries = chart
    .addLineSeries({
      dataPattern: { pattern: "ProgressiveX", regularProgressiveStep: false },
    })
    .setName(name)
    .setStrokeStyle(
      new SolidLine({
        thickness: 2,
        fillStyle: new SolidFill({
          color: ColorHEX(color),
        }),
      })
    )
    .setCursorResultTableFormatter((builder: any, s: any, _: any, y: any) => {
      builder
        .addRow(name + ":")
        .addRow(y.toFixed(2) + (unit ? " " + unit : ""));
      return builder;
    });
  return series;
};

const getSlope = (data: any[], window: number) => {
  let slope: any = [];
  if (data.length > 1) {
    let golayOptions = {
      derivative: 0,
      windowSize: window,
      polynomial: 2,
      pad: "pre",
      padValue: "replicate",
    };
    let values: any = [];
    for (let i = 0; i < data.length; i++) values.push(data[i].value);
    let dxdt: any = [];
    for (let i = 1; i < values.length; i++) {
      let diff = values[i - 1] - values[i];
      let timeDiff = (data[i - 1].ts - data[i].ts) / 1000;
      dxdt.push(diff / timeDiff);
    }
    // @ts-ignore
    let smoothed = savitzkyGolay(dxdt, 1, golayOptions); // TODO: Find the optimal h value
    for (let i = 0; i < smoothed.length; i++) {
      slope.push({ x: data[i + 1]["ts"], y: smoothed[i] });
    }
  }
  return slope;
};

const getDataRate = (sensors: Sensor[]) => {
  let highest_frequency = 0;
  for (const sensor of sensors)
    if (sensor["frequency"] > highest_frequency)
      highest_frequency = sensor["frequency"];
  return Math.ceil(1000 / highest_frequency);
};

const toggleGrid = (chart: any) => {
  var axis = chart.getDefaultAxisY();
  var font = new FontSettings({});
  font = font.setFamily("helvetica");
  font = font.setWeight("bold");
  axis.setTickStyle((visibleTick: any) => {
    const hideGrid = visibleTick.getGridStrokeStyle().fillStyle.color.r !== 1;
    return visibleTick
      .setTickStyle(emptyLine)
      .setLabelFont(font)
      .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
      .setGridStrokeStyle(
        new SolidLine({
          thickness: 1.5,
          fillStyle: new SolidFill({
            color: ColorHEX(hideGrid ? "#FFF" : "#777777"),
          }),
        })
      );
  });
};

const toggleRightAxis = (chart: any) => {
  if (chart.getAxes()[2]) {
    chart.getAxes()[2].dispose();
  } else {
    chart.addAxisY(true);
    var axis = chart.getAxes()[2];
    var font = new FontSettings({});
    font = font.setFamily("helvetica");
    font = font.setWeight("bold");
    axis.setTickStyle((visibleTick: any) =>
      visibleTick
        .setTickStyle(emptyLine)
        .setLabelFont(font)
        .setLabelFillStyle(new SolidFill({ color: ColorHEX("#000") }))
        .setGridStrokeStyle(
          new SolidLine({
            thickness: 1,
            fillStyle: new SolidFill({ color: ColorHEX("#FFF") }),
          })
        )
    );
    axis
      .setScrollStrategy(AxisScrollStrategies.expansion)
      .setMouseInteractions(false) // TODO
      .setStrokeStyle(
        new SolidLine({
          thickness: 3,
          fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
        })
      );
  }
};
