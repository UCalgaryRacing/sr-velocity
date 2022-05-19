// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

// Try to work with useCallback

import React, { useEffect, useState, useRef, useCallback } from "react";
import { IconButton, RangeSlider, ToolTip } from "components/interface";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import {
  lightningChart,
  DataPatterns,
  AxisScrollStrategies,
  SolidLine,
  SolidFill,
  ColorHEX,
  FontSettings,
  emptyLine,
  AxisTickStrategies,
  NumericTickStrategy,
} from "@arction/lcjs";
import savitzkyGolay from "ml-savitzky-golay";
import { useWindowSize } from "hooks";
import "./_styling/lineChart.css";

const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

const colors: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];

interface LineChartProps {
  sensors: Sensor[];
  stream: Stream;
}

// TODO: Handle large amounts of data!
// Optimize for performance and limit certain functions if there is a lot of data
export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
  const size = useWindowSize();
  const dataCallbackRef = useRef(null);
  const [interval, setInterval] = useState<number[]>([0, 1]);
  const [window, setWindow] = useState<number>(5);
  const [dataRate, setDataRate] = useState<number>(getDataRate(props.sensors));
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [lineSeries, setLineSeries] = useState<any>({});
  const [derivatives, setDerivatives] = useState<any>({});
  const [lastValues, setLastValues] = useState<{
    [key: number]: { [k1: string]: number };
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors)
        last[sensor.smallId] = { value: 0, derivative: 0 };
      return last;
    })()
  );

  useEffect(() => {
    // @ts-ignore
    dataCallbackRef.current = onData;
  });

  useEffect(() => {
    let chart = getChart(chartId);
    chart.getDefaultAxisX().setInterval(0, 60 * 1000);
    setChart(chart);
  }, []);

  useEffect(() => {
    if (!chart) return;

    // Configure the line series
    let lineSeries = generateLineSeries(chart, props.sensors);
    setLineSeries(lineSeries);
    for (const datum of props.stream.getHistoricalData()) {
      for (const sensor of props.sensors) {
        if (datum[sensor.smallId]) {
          lineSeries[sensor.smallId].add({
            x: datum["ts"],
            y: datum[sensor.smallId],
          });
        }
      }
    }

    // Bind the data listener
    const smallSensorsIds = props.sensors.map((s) => s.smallId);
    const dataSubscriptionId = props.stream.subscribeToSensors(
      dataCallbackRef,
      smallSensorsIds
    );

    // Clean up
    return () => {
      chart.dispose();
      props.stream.unsubscribeFromSensors(dataSubscriptionId);
    };
  }, [chart]);

  useEffect(() => {
    if (!chart) return;
    const C = 60 * 1000;
    chart.getDefaultAxisX().setInterval(interval[0] * C, interval[1] * C);
  }, [interval]);

  useEffect(() => setDataRate(getDataRate(props.sensors)), [props.sensors]);

  const generateLegend = useCallback(() => {
    if (!lastValues || lastValues === {}) return;
    let legendElements: any = [];
    const generateSensor = (name: string, value: number, unit: string) => (
      <div>{name + ": " + value + " " + unit}</div>
    );
    let i = 0;
    for (const sensor of props.sensors) {
      legendElements.push(
        <div
          key={sensor.smallId}
          className="sensor"
          style={{ color: colors[i] }}
        >
          {generateSensor(
            sensor.name,
            lastValues[sensor.smallId]["value"],
            sensor.unit ? sensor.unit : ""
          )}
          <ToolTip value="Show Derivative (NOTE: This will degrade performance)">
            <IconButton
              text={"∂"}
              onClick={() => toggleDerivative(sensor)}
              style={{
                textDecoration: derivatives[sensor.smallId]
                  ? "line-through"
                  : "none",
              }}
            />
          </ToolTip>
        </div>
      );
      if (derivatives[sensor.smallId]) {
        legendElements.push(
          <div
            className="sensor derivative"
            style={{ color: colors[i] + "80" }}
            key={sensor._id}
          >
            {generateSensor(
              sensor.name + "'",
              lastValues[sensor.smallId]["derivative"],
              sensor.unit + (sensor.unit ? "/s" : "")
            )}
          </div>
        );
      }
      i++;
    }
    return legendElements;
  }, [chart, lastValues, lineSeries, derivatives]);

  const toggleDerivative = useCallback(
    (sensor: Sensor) => {
      let dxdts = { ...derivatives };
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
          sensor.name,
          sensor.unit,
          colors[sensorIndex] + "10"
        );
        dxdts[sensor.smallId].add(
          getDerivate(
            props.stream.getHistoricalSensorData(sensor.smallId),
            window
          )
        );
      }
      setDerivatives(dxdts);
    },
    [chart, derivatives]
  );

  const onData = (data: any, timestamp: number) => {
    let last = { ...lastValues }; // Remove this somehow
    for (const sensor of props.sensors) {
      // Push data into the respective line series
      if (data[sensor.smallId] && lineSeries[sensor.smallId]) {
        lineSeries[sensor.smallId].add({
          x: timestamp,
          y: data[sensor.smallId],
        });
        last[sensor.smallId]["value"] = data[sensor.smallId];
      }
      // TODO: Update the derivate every 0.5 seconds
      if (derivatives[sensor.smallId]) {
        derivatives[sensor.smallId].clear();
        let derivative = getDerivate(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window
        );
        last[sensor.smallId]["derivative"] =
          derivative[derivative.length - 1].y;
        derivatives[sensor.smallId].add(derivative);
      }
    }
    setLastValues(last);
  };

  return (
    <div>
      <div
        className="line-legend"
        style={{
          gridTemplateColumns: (() => {
            let template = "1fr 1fr";
            // TODO: Change based on size, max of 4 per row
            // for (const _ in legend) template += "1fr ";
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
          max={30} // What if there are more than 30 minutes of data?
          step={1}
          lowerValue={0}
          upperValue={1}
          unit="seconds"
          onChange={(interval: number[]) => setInterval(interval)}
        />
      </div>
    </div>
  );
};

const getChart = (chartId: number) => {
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
  // @ts-ignore
  autoCursor.getPointMarker().setSize(0);
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
  let series: any = chart
    .addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
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

const getDerivate = (data: any[], window: number) => {
  let derivate: any = [];
  if (data.length > 1) {
    let values: any = [];
    for (let i = 0; i < data.length; i++) values.push(data[i].value);
    let options = {
      derivative: 1,
      windowSize: window,
      polynomial: 2,
      pad: "pre",
      padValue: "replicate",
    };
    // @ts-ignore
    let smoothed = savitzkyGolay(values, 0.1, options);
    for (let i = 0; i < smoothed.length; i++)
      derivate.push({ x: data[i]["ts"], y: smoothed[i] });
  }
  return derivate;
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
