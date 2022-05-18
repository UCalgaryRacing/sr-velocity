// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

import React, { useEffect, useState } from "react";
import { Stream } from "stream/stream";
import { Sensor, sensorDeleted } from "state";
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
  UIBackground,
  UIEmptyBackground,
  Mutator,
  UIBackgrounds,
} from "@arction/lcjs";

const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

const colours: string[] = [
  "#C22D2D",
  "#0071B2",
  "#009E73",
  "#E69D00",
  "#CC79A7",
];

interface LineChartProps {
  sensors: Sensor[];
  stream: Stream;
}

export const LineChart: React.FC<LineChartProps> = (props: LineChartProps) => {
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [interval, setInterval] = useState<number>(30 * 1000);
  const [smoothingFactor, setSmoothingFactor] = useState<number>(0.03);
  let chart: any = undefined;
  let lineSeries: any = {};

  useEffect(() => {
    // Configure the chart and lines
    chart = getChart(chartId);
    lineSeries = getLineSeries(chart, props.sensors);
    chart.getDefaultAxisX().setInterval(0, interval);

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

    // Bind the data subscribers
    const smallSensorsIds = props.sensors.map((s) => s.smallId);
    const functionId = props.stream.subscribeToSensors(onData, smallSensorsIds);
    return () => {
      props.stream.unsubscribeFromSensors(functionId);
      if (chart) chart.dispose();
    };
  }, []);

  useEffect(() => {
    if (chart) chart.getDefaultAxisX().setInterval(0, interval);
  }, [interval]);

  const onData = (data: any, timestamp: number) => {
    if (chart) {
      for (const sensor of props.sensors) {
        if (data[sensor.smallId]) {
          lineSeries[sensor.smallId].add({
            x: timestamp,
            y: data[sensor.smallId],
          });
        }
      }
    }
  };

  return (
    <div>
      <div className="line-legend"></div>
      <div
        id={chartId.toString()}
        style={{ height: "320px" }}
        className="fill"
      ></div>
      <div className="line-controls"></div>
    </div>
  );
};

const getChart = (chartId: number) => {
  // Configure the base chart
  let chart = lightningChart()
    .ChartXY({
      container: document.getElementById(chartId.toString()) as HTMLDivElement,
    })
    .setBackgroundFillStyle(theme.whiteFill)
    .setSeriesBackgroundFillStyle(theme.whiteFill)
    .setMouseInteractions(true)
    .setMouseInteractionWheelZoom(false)
    .setMouseInteractionPan(false)
    .setMouseInteractionRectangleFit(false)
    .setMouseInteractionRectangleZoom(false)
    .setMouseInteractionsWhileScrolling(false)
    .setMouseInteractionsWhileZooming(false);

  // Remove the title
  chart.setTitle("");

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
      .setLabelPadding(-15);
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

const getLineSeries = (chart: any, sensors: Sensor[]) => {
  let lineSeries: any = {};
  let i = 0;
  for (const sensor of sensors) {
    let series: any = chart
      .addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
      .setName(sensor.name);
    series
      .setStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX(colours[i]) }),
        })
      )
      .setCursorResultTableFormatter((builder: any, s: any, _: any, y: any) => {
        builder
          .addRow(sensor.name + ":")
          .addRow(y.toFixed(2) + " " + sensor.unit);
        return builder;
      });
    lineSeries[sensor.smallId] = series;
    i++;
  }
  return lineSeries;
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
    //axis.setInterval(minValue, maxValue); TODO
  }
};
