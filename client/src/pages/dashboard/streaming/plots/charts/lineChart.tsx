// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis, Abod Abbas

import React, { useEffect, useState } from "react";
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
  emptyTick,
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
  let chart: any = undefined;
  let lineSeries: any = [];

  useEffect(() => {
    chart = getChart(chartId);
    lineSeries = getLineSeries(chart, props.sensors);
    const smallSensorsIds = props.sensors.map((s) => s.smallId);
    const functionId = props.stream.subscribeToSensors(onData, smallSensorsIds);
    return () => {
      props.stream.unsubscribeFromSensors(functionId);
      if (chart) chart.dispose();
    };
  }, []);

  const onData = (data: any, timestamp: number) => {
    if (chart) {
      let index = 0;
      for (const sensor of props.sensors) {
        if (data[sensor.smallId]) {
          lineSeries[index].add({ x: timestamp, y: data[sensor.smallId] });
        }
        index++;
      }
    }
  };

  return (
    <div>
      <div className="legend"></div>
      <div
        id={chartId.toString()}
        style={{ height: "320px" }}
        className="fill"
      ></div>
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
    .setMouseInteractionRectangleFit(true)
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
  //autoCursor.getPointMarker().setSize(0);
  autoCursor.disposeTickMarkerX();
  autoCursor.disposeTickMarkerY();
  var font = new FontSettings({});
  font = font.setFamily("helvetica");
  font = font.setWeight("bold");
  autoCursor.getResultTable().setTextFont(font);
  autoCursor.getResultTable().setTextFillStyle(theme.whiteFill);
  // autoCursor.getResultTable().setBackground(theme.redFill);

  // Configure the axes
  chart
    .getDefaultAxisX()
    .setTitle("")
    .setScrollStrategy(AxisScrollStrategies.progressive)
    .setTickStrategy("Empty")
    .setMouseInteractions(false)
    .setInterval(0, 1000 * 30) // Is this right?
    .setStrokeStyle(
      new SolidLine({ thickness: 1, fillStyle: theme.lightGrayFill })
    );
  chart
    .getDefaultAxisY()
    .setTitle("")
    .setScrollStrategy(AxisScrollStrategies.expansion)
    .setTickStrategy("Empty")
    .setMouseInteractions(false)
    .setStrokeStyle(
      new SolidLine({ thickness: 1, fillStyle: theme.lightGrayFill })
    );
  var axis = chart.getDefaultAxisY();
  var font = new FontSettings({});
  font = font.setFamily("helvetica");
  font = font.setStyle("italic");
  font = font.setSize(8);
  axis.setTickStrategy(
    AxisTickStrategies.Numeric,
    (strategy: NumericTickStrategy) =>
      strategy
        .setMajorTickStyle((tickStyle: any) =>
          tickStyle
            .setGridStrokeStyle(emptyLine)
            .setLabelFont(font)
            .setLabelFillStyle(theme.darkFill)
            .setLabelPadding(-15)
        )
        .setMinorTickStyle((tickStyle: any) =>
          tickStyle
            .setGridStrokeStyle(emptyLine)
            .setLabelFont(font)
            .setLabelFillStyle(theme.darkFill)
            .setLabelPadding(-15)
        )
  );

  // Allow scrolling while hovering over chart
  chart.engine.container.onwheel = null;
  return chart;
};

const getLineSeries = (chart: any, sensors: Sensor[]) => {
  let lineSeries: any = [];
  let index = 0;
  for (const sensor of sensors) {
    let series: any = chart
      .addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })
      .setName(sensor.name);
    series
      .setStrokeStyle(
        new SolidLine({
          thickness: 2,
          fillStyle: new SolidFill({ color: ColorHEX(colours[index]) }),
        })
      )
      .setMouseInteractions(false)
      .setCursorResultTableFormatter(
        (builder: any, series: any, _: any, yValue: any) => {
          builder
            .addRow(series.name + ":")
            .addRow(yValue.toFixed(2) + " " + sensor.unit);
        }
      );
    lineSeries.push(series);
    index++;
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
