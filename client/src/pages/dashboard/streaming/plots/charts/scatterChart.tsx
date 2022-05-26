// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import { DropDown } from "components/interface";
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
  PointSeries,
  PointShape,
  IndividualPointFill,
  ColorRGBA,
} from "@arction/lcjs";
import { useWindowSize } from "hooks";
import "./_styling/scatterPlot.css";

const UPDATE_INTERVAL = 1000; // milliseconds
const colors: string[] = ["#C22D2D", "#0071B2", "#009E73"];
const defaultColor = ColorRGBA(194, 45, 45, 255);
const pointSize = 3;
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

interface ScatterChartProps {
  allSensors: Sensor[];
  sensors: Sensor[];
  stream: Stream;
}

export const ScatterChart: React.FC<ScatterChartProps> = (
  props: ScatterChartProps
) => {
  const size = useWindowSize();

  // Stream subscriptions
  const [dataSubId, setDataSubId] = useState<string>("");
  const dataCallbackRef = useRef<(data: any, timestamp: number) => void>(null);
  const [dataUpdateSubId, setDataUpdateSubId] = useState<string>("");
  const updateDataCallbackRef = useRef<() => void>(null);
  const [connectionSubId, setConnectionSubId] = useState<string>("");
  const connectionCallbackRef = useRef<() => void>(null);

  // Chart state
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [heatSensor, setHeatSensor] = useState<Sensor>();
  const [pointSeries, setPointSeries] = useState<any>();
  const [updateTimer, setUpdateTimer] = useState<number>(UPDATE_INTERVAL);
  const [lastValues, setLastValues] = useState<{
    [key: string]: number;
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors) last[sensor.smallId] = 0;
      return last;
    })()
  );
  const [lastLegendValues, setLastLegendValues] = useState<{
    [key: string]: number;
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors) last[sensor.smallId] = 0;
      return last;
    })()
  );

  useEffect(() => {
    // @ts-ignore
    connectionCallbackRef.current = onConnection; // @ts-ignore
    updateDataCallbackRef.current = onUpdatedData; // @ts-ignore
    dataCallbackRef.current = onData;
  });

  useEffect(() => {
    setChart(createChart(chartId));
    return () => unsubscribeFromStream();
  }, []);

  useEffect(() => {
    if (!chart) return;
    setPointSeries(generatePointSeries(chart));
    const smallIds = props.sensors.map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, smallIds));
    setDataUpdateSubId(
      props.stream.subscribeToDataUpdate(updateDataCallbackRef)
    );
    setConnectionSubId(
      props.stream.subscribeToConnection(connectionCallbackRef)
    );
    return () => {
      try {
        chart && chart.dispose();
      } catch (e) {}
    };
  }, [chart]);

  useEffect(() => {
    if (!pointSeries) return;
    onUpdatedData();
  }, [pointSeries]);

  useEffect(() => {
    // TODO: Create new point series (for auto cursor)
    if (!pointSeries) return;
    onUpdatedData();
  }, [props.sensors]);

  useEffect(() => {
    if (!heatSensor) return;
    props.stream.unsubscribeFromSensors(dataSubId);
    const smallIds = [...props.sensors, heatSensor].map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, smallIds));
    onUpdatedData();
  }, [heatSensor]);

  const unsubscribeFromStream = () => {
    props.stream.unsubscribeFromConnection(connectionSubId);
    props.stream.unsubscribeFromSensors(dataSubId);
    props.stream.unsubscribeFromDataUpdate(dataUpdateSubId);
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
    for (const sensor of [...props.sensors.reverse(), heatSensor]) {
      if (!sensor) continue;
      legendElements.push(
        <div
          key={sensor.smallId}
          className="sensor"
          style={{ color: colors[i] }}
        >
          {generateSensor(
            sensor.name + (i === 0 ? "(Y)" : i === 1 ? "(X)" : "(Heat)"),
            lastLegendValues[sensor.smallId]
              ? lastLegendValues[sensor.smallId]
              : 0,
            sensor.unit ? sensor.unit : ""
          )}
        </div>
      );
      i++;
    }
    return legendElements;
  }, [lastLegendValues]);

  const onConnection = () => {
    if (pointSeries) pointSeries.clear();
    setLastValues({});
  };

  const onData = (data: { [key: string]: number }, _: number) => {
    if (!data || !pointSeries) return;
    let last = { ...lastValues };
    let xSmallId = props.sensors[0].smallId;
    let ySmallId = props.sensors[1].smallId;

    // Extract the data
    let xData = data[xSmallId];
    let yData = data[ySmallId];
    let heatData = heatSensor ? data[heatSensor.smallId] : undefined;

    // Populate last data
    if (xData) last[xSmallId] = xData;
    if (yData) last[ySmallId] = yData;
    if (heatData && heatSensor) last[heatSensor.smallId] = heatData;

    // Populate last legend data
    let lastLegend = { ...lastLegendValues };
    let updateTime = updateTimer - getDataRate(props.sensors);
    if (updateTime <= 0) {
      if (xData) lastLegend[xSmallId] = xData;
      if (yData) lastLegend[ySmallId] = yData;
      if (heatData && heatSensor) lastLegend[heatSensor.smallId] = heatData;
    }

    // Push data
    if (last[xSmallId] && last[ySmallId]) {
      // TODO: If heat sensor, add color
      pointSeries.add({
        x: last[xSmallId],
        y: last[ySmallId],
        size: pointSize,
        color: defaultColor,
      });
    }
    setUpdateTimer(updateTime <= 0 ? UPDATE_INTERVAL : updateTime);
    setLastLegendValues(lastLegend);
    setLastValues(last);
  };

  const onUpdatedData = () => {
    if (!pointSeries) return;
    pointSeries.clear();
    let xData = props.stream.getHistoricalSensorData(props.sensors[0].smallId);
    let yData = props.stream.getHistoricalSensorData(props.sensors[1].smallId);
    let heatData = heatSensor
      ? props.stream.getHistoricalSensorData(heatSensor.smallId)
      : [];

    // Fill X-Y data
    let points: any[] = [];
    let data = fillData(xData, yData);
    xData = data[0];
    yData = data[1];

    // Generate points
    if (heatData.length > 0) {
      let data = fillData(xData, heatData);
      heatData = data[1];
      for (let i = 0; i < xData.length; i++) {
        if (i >= yData.length) break;
        points.push({
          x: xData[i].y,
          y: yData[i].y,
          size: pointSize,
          color: defaultColor,
        });
      }
    } else {
      for (let i = 0; i < xData.length; i++) {
        if (i >= yData.length) break;
        points.push({
          x: xData[i].y,
          y: yData[i].y,
          size: pointSize,
          color: defaultColor,
        });
      }
    }
    pointSeries.add(points);
  };

  return (
    <div>
      <div
        className="line-legend" // Make generic legend component?
        style={{
          gridTemplateColumns: (() => {
            let template = "1fr 1fr ";
            if (heatSensor) template += "1fr";
            return template;
          })(),
        }}
      >
        {generateLegend()}
      </div>
      <div
        id={chartId.toString()}
        style={{ height: size.width >= 916 ? "320px" : "250px" }}
        className="fill"
      ></div>
      <div className="scatter-controls">{}</div>
    </div>
  );
};

const createChart = (chartId: number) => {
  // Create the chart
  let chart = lightningChart()
    .ChartXY({
      container: document.getElementById(chartId.toString()) as HTMLDivElement,
    })
    .setTitle("")
    .setBackgroundFillStyle(theme.whiteFill)
    .setSeriesBackgroundFillStyle(theme.whiteFill)
    .setMouseInteractions(false)
    .setMouseInteractionWheelZoom(false)
    .setMouseInteractionPan(false)
    .setMouseInteractionRectangleFit(false)
    .setMouseInteractionRectangleZoom(false)
    .setMouseInteractionsWhileScrolling(false)
    .setMouseInteractionsWhileZooming(false);

  // Configure the auto cursor
  let autoCursor = chart.getAutoCursor();
  autoCursor.setGridStrokeXStyle(
    new SolidLine({
      thickness: 1,
      fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
    })
  );
  autoCursor.setGridStrokeYStyle(
    new SolidLine({
      thickness: 1,
      fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
    })
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

  // Format the X-Axis
  chart
    .setTitle("")
    .getDefaultAxisX()
    .setScrollStrategy(AxisScrollStrategies.fitting)
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

  // Format the Y-Axis
  chart
    .setTitle("")
    .getDefaultAxisY()
    .setScrollStrategy(AxisScrollStrategies.fitting)
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

  // Don't allow scrolling
  chart.engine.container.onwheel = null;
  chart.engine.container.ontouchstart = null;
  return chart;
};

const generatePointSeries = (chart: any) => {
  let individualStyle = new IndividualPointFill();
  individualStyle.setFallbackColor(ColorRGBA(0, 0, 0, 255));
  let series: PointSeries = chart
    .addPointSeries({
      pointShape: PointShape.Circle,
    })
    .setPointSize(pointSize)
    .setPointFillStyle(individualStyle);
  return series;
};

const getDataRate = (sensors: Sensor[]) => {
  let highest_frequency = 0;
  for (const sensor of sensors)
    if (sensor["frequency"] > highest_frequency)
      highest_frequency = sensor["frequency"];
  return Math.ceil(1000 / Math.min(highest_frequency, 30));
};

const fillData = (a: any[], b: any[]) => {
  let filled: any[] = [];
  let longerData = a.length > b.length ? a : b;
  let shorterData = a.length > b.length ? b : a;
  let j = 0;
  for (let i = 0; i < longerData.length; i++) {
    if (j >= shorterData.length) break;
    filled.push({ x: longerData[i].x, y: shorterData[j].y });
    if (longerData[i].x <= shorterData[j].x) j++;
  }
  a = a.length > b.length ? longerData : filled;
  b = a.length > b.length ? filled : longerData;
  return [a, b];
};
