// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import { InputField } from "components/interface";
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
import colormap from "colormap";
import { useForm, useWindowSize } from "hooks";
import "./_styling/scatterChart.css";

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
const colorMap = colormap({
  colormap: "jet",
  nshades: 500,
  format: "hex",
  alpha: 1,
});

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
  const [pointSeries, setPointSeries] = useState<any>();
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
  const [updateTimer, setUpdateTimer] = useState<number>(UPDATE_INTERVAL);
  const [values, handleChange] = useForm({
    lower: "",
    upper: "",
  });

  useEffect(() => {
    // @ts-ignore
    connectionCallbackRef.current = onConnection; // @ts-ignore
    updateDataCallbackRef.current = onUpdatedData; // @ts-ignore
    dataCallbackRef.current = onData;
  });

  useEffect(() => {
    setChart(createChart(chartId, props.sensors));
    return () => unsubscribeFromStream();
  }, []);

  useEffect(() => {
    if (!chart) return;
    setPointSeries(generatePointSeries(chart, props.sensors));
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
    if (!pointSeries || !chart) return;
    props.stream.unsubscribeFromSensors(dataSubId);
    const smallIds = [...props.sensors].map((s) => s.smallId);
    setDataSubId(props.stream.subscribeToSensors(dataCallbackRef, smallIds));
    setPointSeries(generatePointSeries(chart, props.sensors));
    const xSensor = props.sensors[0];
    chart
      .getDefaultAxisX()
      .setTitle(xSensor.name + (xSensor.unit ? "(" + xSensor.unit + ")" : ""));
    const ySensor = props.sensors[1];
    chart
      .getDefaultAxisX()
      .setTitle(ySensor.name + (ySensor.unit ? "(" + ySensor.unit + ")" : ""));
  }, [props.sensors]);

  useEffect(() => {
    if (boundsValid()) onUpdatedData();
  }, [values]);

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
    for (const sensor of props.sensors) {
      if (!sensor) continue;
      legendElements.push(
        <div
          key={sensor.smallId}
          className="sensor"
          style={{ color: colors[i] }}
        >
          {generateSensor(
            sensor.name + (i === 0 ? "(X)" : i === 1 ? "(Y)" : "(Heat)"),
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
    let heatData =
      props.sensors.length > 2 ? data[props.sensors[2].smallId] : undefined;

    // Populate last data
    if (xData) last[xSmallId] = xData;
    if (yData) last[ySmallId] = yData;
    if (heatData && props.sensors.length > 2)
      last[props.sensors[2].smallId] = heatData;

    // Populate last legend data
    let lastLegend = { ...lastLegendValues };
    let updateTime = updateTimer - getDataRate(props.sensors);
    if (updateTime <= 0) {
      if (xData) lastLegend[xSmallId] = xData;
      if (yData) lastLegend[ySmallId] = yData;
      if (heatData && props.sensors.length > 2)
        lastLegend[props.sensors[2].smallId] = heatData;
    }

    // Push data
    if (last[xSmallId] && last[ySmallId]) {
      let color = defaultColor;
      if (last[props.sensors[2].smallId] && boundsValid()) {
        let lower = Number(values.lower);
        let upper = Number(values.upper);
        let index = Math.round(
          ((last[props.sensors[2].smallId] - lower) / Math.abs(upper - lower)) *
            colorMap.length -
            1
        );
        if (index < 0) index = 0;
        if (index > colorMap.length - 1) index = colorMap.length - 1;
        color = ColorHEX(colorMap[index]);
      }
      pointSeries.add({
        x: last[xSmallId],
        y: last[ySmallId],
        size: pointSize,
        color: color,
        value: last[props.sensors[2].smallId],
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
    let heatData =
      props.sensors.length > 2
        ? props.stream.getHistoricalSensorData(props.sensors[2].smallId)
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
        if (i >= yData.length || i >= heatData.length) break;
        let color = defaultColor;
        if (heatData && boundsValid()) {
          let lower = Number(values.lower);
          let upper = Number(values.upper);
          let index = Math.round(
            ((heatData[i].y - lower) / Math.abs(upper - lower)) *
              colorMap.length -
              1
          );
          if (index < 0) index = 0;
          if (index > colorMap.length - 1) index = colorMap.length - 1;
          color = ColorHEX(colorMap[index]);
        }
        points.push({
          x: xData[i].y,
          y: yData[i].y,
          size: pointSize,
          color: color,
          value: heatData[i].y,
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

  const boundsValid = () => {
    if (values.upper !== "" && values.lower !== "") {
      let lower = Number(values.lower);
      let upper = Number(values.upper);
      return lower < upper;
    } else {
      return false;
    }
  };

  return (
    <div className="scatter-chart">
      <div
        className="line-legend" // Make generic legend component?
        style={{
          gridTemplateColumns: (() => {
            let template = "1fr 1fr ";
            if (
              props.sensors.length > 2 &&
              (size.width >= 1000 || size.width > size.height)
            )
              template += "1fr";
            return template;
          })(),
        }}
      >
        {generateLegend()}
      </div>
      <div id={chartId.toString()} className="fill"></div>
      {props.sensors.length > 2 && (
        <div className="scatter-controls">
          <InputField
            name="lower"
            title="Lower Heat Bound"
            type="number"
            value={values.lower}
            onChange={handleChange}
          />
          <InputField
            name="upper"
            title="Upper Heat Bound"
            type="number"
            value={values.upper}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};

const createChart = (chartId: number, sensors: Sensor[]) => {
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
      .setLabelPadding(-7)
      .setTickPadding(0)
      .setTickLength(3);

  // Format the X-Axis
  let xSensor = sensors[0];
  let xTitle = xSensor.name;
  xTitle += xSensor.unit ? "(" + xSensor.unit + ")" : "";
  chart
    .getDefaultAxisX()
    .setTitle(xTitle)
    .setTitleFont((font: FontSettings) =>
      font.setFamily("helvetica").setStyle("italic").setSize(10)
    )
    .setTitleFillStyle(theme.darkFill)
    .setTitleMargin(-15)
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
  let ySensor = sensors[1];
  let yTitle = ySensor.name;
  yTitle += ySensor.unit ? " (" + ySensor.unit + ")" : "";
  chart
    .getDefaultAxisY()
    .setTitle(yTitle)
    .setTitleFont((font: FontSettings) =>
      font.setFamily("helvetica").setStyle("italic").setSize(10)
    )
    .setTitleFillStyle(theme.darkFill)
    .setTitleMargin(-15)
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

const generatePointSeries = (chart: any, sensors: Sensor[]) => {
  let individualStyle = new IndividualPointFill();
  individualStyle.setFallbackColor(ColorRGBA(0, 0, 0, 255));
  let series: PointSeries = chart
    .addPointSeries({
      pointShape: PointShape.Circle,
    })
    .setPointSize(pointSize)
    .setPointFillStyle(individualStyle)
    .setCursorResultTableFormatter(
      (builder: any, s: any, x: any, y: any, dataPoint: any) => {
        builder
          .addRow(
            sensors[0].name +
              ": " +
              x.toFixed(2) +
              (sensors[0].unit ? " " + sensors[0].unit : "")
          )
          .addRow(
            sensors[1].name +
              ": " +
              y.toFixed(2) +
              (sensors[1].unit ? " " + sensors[1].unit : "")
          );
        if (sensors.length > 2) {
          builder.addRow(
            sensors[2].name +
              ": " +
              dataPoint.value.toFixed(2) +
              (sensors[2].unit ? " " + sensors[2].unit : "")
          );
        }
        return builder;
      }
    );
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
    if (longerData[i].x >= shorterData[j].x) j++;
  }
  a = a.length > b.length ? longerData : filled;
  b = a.length > b.length ? filled : longerData;
  return [a, b];
};
