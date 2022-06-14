// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useCallback } from "react";
import { Sensor, Session } from "state";
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
import { CircularProgress } from "@mui/material";
import { getSessionSensorData } from "crud";
import { useForm, useWindowSize } from "hooks";
import "./_styling/scatterChart.css";

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

interface StaticScatterChartProps {
  allSensors: Sensor[];
  sensors: Sensor[];
  session: Session;
}

export const StaticScatterChart: React.FC<StaticScatterChartProps> = (
  props: StaticScatterChartProps
) => {
  const size = useWindowSize();

  // Control state
  const [fetching, setFetching] = useState<boolean>(false);

  // Chart state
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [data, setData] = useState<{ [k: string]: any[] }>();
  const [pointSeries, setPointSeries] = useState<any>();
  const [values, handleChange] = useForm({
    lower: "",
    upper: "",
  });

  useEffect(() => {
    if (data) {
      // Clear any old sensors
      for (const [key, _] of Object.entries(data)) {
        if (props.sensors.filter((s) => s._id === key).length === 0) {
          delete data[key];
        }
      }

      // Check if any sensors have changed
      if (Object.keys(data).length === props.sensors.length) {
        let changed = false;
        for (const sensor of props.sensors) {
          if (!data[sensor._id]) {
            changed = true;
          }
        }
        if (!changed) return;
      }

      // Check if a sensor has been removed
      if (Object.keys(data).length > props.sensors.length) {
        let newData: any = {};
        for (const sensor of props.sensors) {
          newData[sensor._id] = data[sensor._id];
        }
        setData(newData);
        return;
      }
    }

    // Fetch the data
    setFetching(true);
    const getData = async () => {
      let newData: any = { ...data };
      for (const sensor of props.sensors) {
        if (data && data[sensor._id] && data[sensor._id].length !== 0) continue;
        try {
          const sensorData = await getSessionSensorData(
            props.session._id,
            sensor._id
          );
          newData[sensor._id] = sensorData.data;
        } catch (e) {
          newData[sensor._id] = [];
        }
      }
      setFetching(false);
      setData(newData);
    };
    getData();
  }, [props.sensors, props.session]);

  useEffect(() => {
    if (!fetching) setChart(createChart(chartId, props.sensors));
    else {
      try {
        chart && chart.dispose();
      } catch (e) {}
    }
  }, [fetching]);

  useEffect(() => {
    if (!data) return;
    if (pointSeries) pointSeries.dispose();
    setPointSeries(generatePointSeries(chart, props.sensors));
  }, [data]);

  useEffect(() => updateData(), [pointSeries]);

  useEffect(() => {
    if (values.upper !== "" && values.lower !== "") updateData();
  }, [values]);

  const updateData = () => {
    if (!data || !pointSeries) return;
    const filledData = { ...data };
    let filled = fillData(
      data[props.sensors[0]._id],
      data[props.sensors[1]._id]
    );
    filledData[props.sensors[0]._id] = filled[0];
    filledData[props.sensors[1]._id] = filled[1];
    if (props.sensors.length > 2) {
      console.log(props.sensors.length);
      filled = fillData(filled[0], data[props.sensors[2]._id]);
      filledData[props.sensors[2]._id] = filled[1];
    }
    let pointData: any[] = [];
    let i = 0;
    for (const sensor of props.sensors) {
      let j = 0;
      for (const datum of filledData[sensor._id]) {
        if (i === 0)
          pointData.push({ x: datum.y, pointSize: 3, color: defaultColor });
        if (i === 1) pointData[j].y = datum.y;
        if (i === 2) {
          pointData[j].value = datum.y;
          if (values.upper !== "" && values.lower !== "") {
            let lower = Number(values.lower);
            let upper = Number(values.upper);
            let index = Math.round(
              ((datum.y - lower) / Math.abs(upper - lower)) * colorMap.length -
                1
            );
            if (index < 0) index = 0;
            if (index > colorMap.length - 1) index = colorMap.length - 1;
            pointData[j].color = ColorHEX(colorMap[index]);
          }
        }
        j++;
      }
      i++;
    }
    pointSeries.add(pointData);
  };

  const generateLegend = useCallback(() => {
    let legendElements: any = [];
    const generateSensor = (name: string, unit: string) => (
      <div>{name + (unit === "" ? "" : " (" + unit + ")")}</div>
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
            sensor.name + (i === 2 ? " (Heat)" : ""),
            sensor.unit ? sensor.unit : ""
          )}
        </div>
      );
      i++;
    }
    return legendElements;
  }, [data]);

  const boundsValid = () => {
    if (values.upper !== "" && values.lower !== "") {
      let lower = Number(values.lower);
      let upper = Number(values.upper);
      return lower < upper;
    } else {
      return false;
    }
  };

  if (fetching) {
    return (
      <div className="chart-loading">
        <div className="chart-loading-content">
          <CircularProgress style={{ color: "black" }} />
          <br />
          <br />
          <b>Fetching Data...</b>
        </div>
      </div>
    );
  } else {
    return (
      <div className="scatter-chart">
        <div
          className="line-legend"
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
              placeholder="Lower Heat Bound"
              type="number"
              value={values.lower}
              onChange={handleChange}
            />
            <InputField
              name="upper"
              placeholder="Upper Heat Bound"
              type="number"
              value={values.upper}
              onChange={handleChange}
            />
          </div>
        )}
      </div>
    );
  }
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
  xTitle += xSensor.unit ? " (" + xSensor.unit + ")" : "";
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
  chart.engine.container.ontouchmove = null;
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
