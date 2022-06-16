// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import {
  IconButton,
  RangeSlider,
  ToolTip,
  SingleSlider,
} from "components/interface";
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

const UPDATE_INTERVAL = 1000; // milliseconds
const MAX_FREQUENCY = 24;
const colors: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

interface DynamicLineChartProps {
  sensors: Sensor[];
  stream: Stream;
}

export const DynamicLineChart: React.FC<DynamicLineChartProps> = (
  props: DynamicLineChartProps
) => {
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
  const [streaming, setStreaming] = useState<boolean>(false);
  const [interval, setInterval] = useState<number[]>();
  const [window, setWindow] = useState<number>(5);
  const [legend, setLegend] = useState<any>();
  const [updateTimer, setUpdateTimer] = useState<number>(0);
  const [stopExpanding, setStopExpanding] = useState<boolean>(false);

  // Chart state
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [lineSeries, setLineSeries] = useState<{ [k: string]: LineSeries }>({});
  const [slopes, setSlopes] = useState<{ [k: string]: LineSeries }>({});
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [lastValues, setLastValues] = useState<{
    [key: string]: { [k1: string]: number };
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors)
        last[sensor._id] = { value: 0, slope: 0 };
      return last;
    })()
  );
  const [legendValues, setLegendValues] = useState<{
    [key: string]: { [k1: string]: number };
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors)
        last[sensor._id] = { value: 0, slope: 0 };
      return last;
    })()
  );

  useEffect(() => {
    // @ts-ignore
    dataCallbackRef.current = onData; // @ts-ignore
    missingDataCallbackRef.current = onUpdatedData; // @ts-ignore
    connectionCallbackRef.current = onConnection; // @ts-ignore
    stopCallbackRef.current = onStop; // @ts-ignore
    disconnectCallbackRef.current = onDisconnect;
  });

  useEffect(() => {
    const offset = props.stream.getFirstTimeStamp();
    setChart(createChart(chartId, [offset, 0.25 * 60 * 1000 + offset]));
    setInterval([0, 0.25 * 60 * 1000]);
    return () => unsubscribeFromStream();
  }, []);

  useEffect(() => {
    if (!chart) return;
    initializeLineSeries();
    const _ids = props.sensors.map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, _ids));
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
    generateLegend();
    return () => {
      unsubscribeFromStream();
      try {
        chart && chart.dispose();
      } catch (e) {}
    };
  }, [chart]);

  useEffect(() => {
    for (const sensor of props.sensors) {
      let sensorData = props.stream.getHistoricalSensorData(sensor.smallId);
      if (lineSeries[sensor._id] && sensorData.length > 0)
        lineSeries[sensor._id].add(sensorData);
    }
  }, [lineSeries]);

  useEffect(() => {
    if (!chart) return;
    setLastValues(
      (() => {
        let last: any = {};
        for (const sensor of props.sensors)
          last[sensor._id] = { value: 0, slope: 0 };
        return last;
      })()
    );
    props.stream.unsubscribeFromSensors(dataSubId);
    initializeLineSeries();
    const _ids = props.sensors.map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, _ids));
  }, [props.sensors]);

  useEffect(() => {
    if (!chart || !interval) return;
    const offset = props.stream.getFirstTimeStamp();
    const stopExpanding = interval[1] + offset < currentTimestamp;
    chart.getDefaultAxisX().setInterval(
      interval[0] + offset,
      interval[1] + offset,
      false,
      !streaming || stopExpanding // Disable scrolling when disconnected
    );
    setStopExpanding(stopExpanding);
  }, [interval, streaming, props.stream]);

  useEffect(() => {
    if (!interval) return;
    if (stopExpanding)
      setStopExpanding(
        chart.getDefaultAxisX().getInterval().end < currentTimestamp
      );
  }, [currentTimestamp]);

  useEffect(() => {
    if (!interval) return;
    const offset = props.stream.getFirstTimeStamp();
    chart
      .getDefaultAxisX()
      .setInterval(
        interval[0] + offset,
        interval[1] + offset,
        false,
        !streaming || !stopExpanding
      );
  }, [stopExpanding]);

  useEffect(() => {
    for (const sensor of props.sensors) {
      if (slopes[sensor._id]) {
        slopes[sensor._id].clear();
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window,
          sensor.frequency
        );
        if (slope.length > 0) slopes[sensor._id].add(slope);
      }
    }
  }, [window]);

  useEffect(() => {
    generateLegend();
  }, [legendValues]);

  const unsubscribeFromStream = () => {
    props.stream.unsubscribeFromConnection(connectionSubId);
    props.stream.unsubscribeFromStop(stopSubId);
    props.stream.unsubscribeFromDisconnection(disconnectSubId);
    props.stream.unsubscribeFromSensors(dataSubId);
    props.stream.unsubscribeFromDataUpdate(dataUpdateSubId);
  };

  const initializeLineSeries = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.dispose();
    for (const [_, series] of Object.entries(slopes)) series.dispose();
    setLineSeries(generateLineSeries(chart, props.sensors));
    setSlopes({});
  };

  const generateLegend = () => {
    if (!legendValues || legendValues === {}) return;
    let legendElements: any = [];
    const generateSensor = (name: string, value: number, unit: string) => (
      <div className="legend-item">
        <div className="legend-item-name">{name}</div>
        {": " + value.toFixed(2).replace(/[.,]00$/, "") + " " + unit}
      </div>
    );
    let i = 0;
    for (const sensor of props.sensors) {
      legendElements.push(
        <div key={sensor._id} className="sensor" style={{ color: colors[i] }}>
          <ToolTip value="Derivative">
            <IconButton
              text={"∂"}
              onClick={() => toggleSlope(sensor)}
              style={{
                backgroundColor: colors[i],
                textDecoration: slopes[sensor._id] ? "line-through" : "none",
              }}
            />
          </ToolTip>
          {generateSensor(
            sensor.name,
            legendValues[sensor._id] ? legendValues[sensor._id]["value"] : 0,
            sensor.unit ? sensor.unit : ""
          )}
        </div>
      );
      if (slopes[sensor._id]) {
        legendElements.push(
          <div
            className="sensor slope"
            style={{ color: colors[i] + "80" }}
            key={sensor._id}
          >
            {generateSensor(
              sensor.name + "'",
              legendValues[sensor._id]["slope"],
              (sensor.unit ? sensor.unit : "1") + "/s"
            )}
          </div>
        );
      }
      i++;
    }
    setLegend(legendElements);
  };

  const toggleSlope = useCallback(
    (sensor: Sensor) => {
      let dxdts = { ...slopes };
      if (dxdts[sensor._id]) {
        dxdts[sensor._id].dispose();
        delete dxdts[sensor._id];
      } else {
        let sensorIndex = 0;
        for (const i in props.sensors)
          if (props.sensors[i]._id === sensor._id) sensorIndex = Number(i);
        dxdts[sensor._id] = createSeries(
          chart,
          sensor.name + "'",
          sensor.unit,
          colors[sensorIndex] + "10"
        );
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window,
          sensor.frequency
        );
        if (slope.length === 0) {
          dxdts[sensor._id].dispose();
          return;
        }
        dxdts[sensor._id].add(slope);
      }
      setSlopes(dxdts);
    },
    [chart, slopes]
  );

  const onConnection = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.dispose();
    setSlopes({});
    setInterval(interval);
    setStreaming(true);
  };

  const onStop = () => {
    setStreaming(false);
  };

  const onDisconnect = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.clear();
    setStreaming(false);
  };

  const onData = (data: { [key: string]: number }, timestamp: number) => {
    if (!data) return;
    let last = { ...lastValues };
    let updateTime = updateTimer - getDataRate(props.sensors);
    for (const sensor of props.sensors) {
      if (data[sensor.smallId] && lineSeries[sensor._id]) {
        lineSeries[sensor._id].add({
          x: timestamp,
          y: data[sensor.smallId],
        });
        last[sensor._id]["value"] = data[sensor.smallId];
      }
      if (slopes[sensor.smallId] && updateTimer == 0) {
        slopes[sensor.smallId].clear();
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window,
          sensor.frequency
        );
        slopes[sensor._id].add(slope);
        if (slope.length !== 0)
          last[sensor._id]["slope"] = slope[slope.length - 1].y;
      }
    }
    if (updateTimer === 0) setLegendValues(last);
    setUpdateTimer(updateTime < 0 ? UPDATE_INTERVAL : updateTime);
    setLastValues(last);
    setStreaming(true);
    setCurrentTimestamp(props.stream.getCurrentTimeStamp());
  };

  const onUpdatedData = () => {
    for (const [_, series] of Object.entries(lineSeries)) series.clear();
    for (const [_, series] of Object.entries(slopes)) series.clear();
    for (const sensor of props.sensors) {
      let sensorData = props.stream.getHistoricalSensorData(sensor.smallId);
      if (lineSeries[sensor._id] && sensorData.length > 0)
        lineSeries[sensor._id].add(sensorData);
    }
    for (const sensor of props.sensors) {
      if (slopes[sensor._id]) {
        let slope = getSlope(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window,
          sensor.frequency
        );
        if (slope.length > 0) slopes[sensor._id].add(slope);
      }
    }
    if (interval) {
      chart.getDefaultAxisX().setInterval(
        interval[0],
        interval[1],
        false,
        !streaming // Disable scrolling when disconnected
      );
    }
  };

  return (
    <div className="line-chart">
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
        {legend}
      </div>
      <div id={chartId.toString()} className="fill"></div>
      <div className="line-controls">
        <RangeSlider
          title="Interval"
          tipFormatter={(value: any) => `${value / 4} minutes`}
          min={0}
          max={120}
          step={1}
          lowerValue={0}
          upperValue={1}
          unit="minutes"
          onChange={(interval: number[]) => {
            setInterval(
              interval.map(
                // Milliseconds
                (x) => (x / 4) * 60 * 1000
              )
            );
          }}
        />
        {Object.keys(slopes).length > 0 && (
          <>
            <SingleSlider
              title="Derivative Smoothing Factor"
              min={0}
              max={100}
              tipFormatter={(value: any) => `${value}`}
              step={2}
              default={5}
              unit="seconds"
              onChange={(w: number) => setWindow(w + 5)}
            />
          </>
        )}
      </div>
    </div>
  );
};

const createChart = (chartId: number, interval: number[]) => {
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
    .setBackground((background: any) => background.setFillStyle(theme.redFill));

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
      .setLabelPadding(-14)
      .setTickPadding(1)
      .setTickLength(3);

  chart
    .getDefaultAxisY()
    .setTitle("")
    .setScrollStrategy(AxisScrollStrategies.fitting)
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
    )
    .setInterval(-1, 1);

  // Allow scrolling while hovering over chart
  chart.engine.container.onwheel = null;
  chart.engine.container.ontouchstart = null;
  chart.engine.container.ontouchmove = null;

  toggleGrid(chart);
  return chart;
};

const generateLineSeries = (chart: any, sensors: Sensor[]) => {
  let lineSeries: any = {};
  let i = 0;
  for (const sensor of sensors) {
    lineSeries[sensor._id] = createSeries(
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

const getSlope = (data: any[], window: number, frequency: number) => {
  frequency = Math.min(MAX_FREQUENCY, frequency);
  let slope: any = [];
  if (data.length > 1) {
    let golayOptions = {
      derivative: 0,
      windowSize: Math.ceil(window * frequency) | 1,
      polynomial: 2,
      pad: "post",
      padValue: "replicate",
    };
    let values: any = [];
    for (let i = 0; i < data.length; i++) values.push(data[i].y);
    let dxdt: any = [];
    for (let i = 1; i < values.length; i++) {
      let diff = values[i - 1] - values[i];
      let timeDiff = (data[i - 1].x - data[i].x) / 1000;
      dxdt.push(diff / timeDiff);
    }
    try {
      // @ts-ignore
      let smoothed = savitzkyGolay(dxdt, 1, golayOptions); // TODO: Find the optimal h value
      for (let i = 0; i < smoothed.length; i++) {
        slope.push({ x: data[i + 1].x, y: smoothed[i] });
      }
    } catch {}
  }
  return slope;
};

const getDataRate = (sensors: Sensor[]) => {
  let highest_frequency = 0;
  for (const sensor of sensors)
    if (sensor["frequency"] > highest_frequency)
      highest_frequency = sensor["frequency"];
  return Math.ceil(1000 / Math.min(highest_frequency, MAX_FREQUENCY));
};

const toggleGrid = (chart: any) => {
  var axis = chart.getDefaultAxisY();
  var font = new FontSettings({});
  font = font.setFamily("helvetica");
  font = font.setWeight("bold");
  axis.setTickStrategy(
    AxisTickStrategies.Numeric,
    (strategy: NumericTickStrategy) =>
      strategy
        .setMinorTickStyle((visibleTicks) =>
          // @ts-ignore
          visibleTicks.setGridStrokeStyle(
            new SolidLine({
              thickness: 0.15,
              fillStyle: theme.lightGrayFill,
            })
          )
        )
        .setMajorTickStyle((visibleTicks) =>
          visibleTicks.setGridStrokeStyle(
            new SolidLine({
              thickness: 0.15,
              fillStyle: theme.lightGrayFill,
            })
          )
        )
  );
};
