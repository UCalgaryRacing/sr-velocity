// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

import React, { useEffect, useState } from "react";
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

const colours: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];

interface LineChartProps {
  sensors: Sensor[];
  stream: Stream;
}

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
  const size = useWindowSize();
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [interval, setInterval] = useState<number[]>([0, 1]);
  const [window, setWindow] = useState<number>(5);
  const [dataRate, setDataRate] = useState<number>(getDataRate(props.sensors));
  const [lastValues, setLastValues] = useState<{ [key: number]: number }>({});
  const [legend, setLegend] = useState<any>();
  let chart: any = undefined;
  let lineSeries: any = {};
  let derivates: any = {};
  let lastDerivate: number = 500;

  useEffect(() => {
    // Configure the chart and lines
    chart = getChart(chartId);
    lineSeries = generateLineSeries(chart, props.sensors);

    // Push the pre-existing sensor data
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

    // Set the latest values to zero
    let last: any = {};
    for (const sensor of props.sensors) last[sensor.smallId] = 0;
    setLastValues(last);

    // Bind the data subscribers
    const smallSensorsIds = props.sensors.map((s) => s.smallId);
    const functionId = props.stream.subscribeToSensors(onData, smallSensorsIds);
    return () => {
      props.stream.unsubscribeFromSensors(functionId);
      if (chart) chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (chart)
      chart
        .getDefaultAxisX()
        .setInterval(interval[0] * 60 * 1000, interval[1] * 60 * 1000);
  }, [interval]);

  useEffect(() => generateLegend(), [lastValues]);
  useEffect(() => setDataRate(getDataRate(props.sensors)), [props.sensors]);

  const onData = (data: any, timestamp: number) => {
    if (!chart) return;
    lastDerivate -= dataRate;
    let last = { ...lastValues };
    for (const sensor of props.sensors) {
      // Push data into the respective line series
      if (data[sensor.smallId]) {
        lineSeries[sensor.smallId].add({
          x: timestamp,
          y: data[sensor.smallId],
        });
        last[sensor.smallId] = data[sensor.smallId];
      }
      // Update the derivate every 0.5 seconds
      if (lastDerivate <= 0 && derivates[sensor.smallId]) {
        derivates[sensor.smallId].clear();
        derivates[sensor.smallId].add(
          getDerivate(
            props.stream.getHistoricalSensorData(sensor.smallId),
            window
          )
        );
      }
    }
    if (lastDerivate <= 0) lastDerivate = 500;
    setLastValues(last);
  };

  const toggleDerivate = (sensor: Sensor) => {
    if (derivates[sensor.smallId]) {
      derivates[sensor.smallId].dispose();
      delete derivates[sensor.smallId];
    } else {
      let sensorIndex = 0;
      for (const i in props.sensors)
        if (props.sensors[i].smallId === sensor.smallId)
          sensorIndex = Number(i);
      derivates[sensor.smallId] = createSeries(
        chart,
        sensor.name,
        sensor.unit,
        colours[sensorIndex] + "80"
      );
      derivates[sensor.smallId].add(
        getDerivate(
          props.stream.getHistoricalSensorData(sensor.smallId),
          window
        )
      );
    }
  };

  const generateLegend = () => {
    let legendElements: any = [];
    const generateSensor = (name: string, value: number, unit: string) => (
      <div>{name + ": " + value + " " + unit}</div>
    );
    let i = 0;
    for (const sensor of props.sensors) {
      legendElements.push(
        <div className="sensor" style={{ color: colours[i] }}>
          {generateSensor(
            sensor.name,
            lastValues[sensor.smallId],
            sensor.unit ? sensor.unit : ""
          )}
          <ToolTip value="Show Derivate (NOTE: This will degrade performance)">
            <IconButton
              text={"∂"}
              onClick={() => toggleDerivate(sensor)}
              style={{
                textDecoration: derivates[sensor.smallId]
                  ? "line-through"
                  : "none",
              }}
            />
          </ToolTip>
        </div>
      );
      if (derivates[sensor.smallId]) {
        legendElements.push(
          <div className="sensor" style={{ color: colours[i] }}>
            {generateSensor(
              sensor.name,
              lastValues[sensor.smallId],
              sensor.unit + (sensor.unit ? "/s" : "")
            )}
          </div>
        );
      }
      i++;
    }
    setLegend(legendElements);
  };

  return (
    <div>
      <div
        className="line-legend"
        style={{
          gridTemplateColumns: (() => {
            let template = "";
            // TODO: Change based on size
            for (const _ in legend) template += "1fr ";
            return template;
          })(),
        }}
      >
        {legend}
      </div>
      <div
        id={chartId.toString()}
        style={{ height: size.width >= 768.9 ? "320px" : "250px" }}
        className="fill"
      ></div>
      <div className="line-controls">
        <RangeSlider
          title="Interval"
          min={0}
          max={30}
          step={1}
          lowerValue={0}
          upperValue={15}
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
      colours[i]
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
