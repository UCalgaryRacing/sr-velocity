// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState, useCallback } from "react";
import { Sensor, Session } from "state";
import { RangeSlider } from "components/interface";
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
import { CircularProgress } from "@mui/material";
import { getSessionSensorData } from "crud";
import { useWindowSize } from "hooks";
import "./_styling/lineChart.css";

const colors: string[] = ["#C22D2D", "#0071B2", "#009E73", "#E69D00"];
const theme = {
  whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
  lightGrayFill: new SolidFill({ color: ColorHEX("#777777") }),
  darkFill: new SolidFill({ color: ColorHEX("#171717") }),
  redFill: new SolidFill({ color: ColorHEX("#C22D2D") }),
};

interface StaticLineChartProps {
  sensors: Sensor[];
  session: Session;
}

export const StaticLineChart: React.FC<StaticLineChartProps> = (
  props: StaticLineChartProps
) => {
  const size = useWindowSize();

  // Control State
  const [fetching, setFetching] = useState<boolean>(false);
  const [range, setRange] = useState<number[]>([-1, -1]);
  const [interval, setInterval] = useState<number[]>([0, 1]);
  const [window, setWindow] = useState<number>(5);

  // Chart State
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [lineSeries, setLineSeries] = useState<{ [k: string]: LineSeries }>({});
  const [data, setData] = useState<{ [k: string]: any[] }>();

  useEffect(() => {
    let cleanData = { ...data };
    if (data) {
      // Clear any old sensors
      for (const [key, _] of Object.entries(data)) {
        if (props.sensors.filter((s) => s._id === key).length === 0) {
          delete cleanData[key];
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
    const getData = async (data: any) => {
      let newRange = [0, 1];
      let newData: any = { ...data };
      for (const sensor of props.sensors) {
        if (data && data[sensor._id] && data[sensor._id].length !== 0) continue;
        try {
          const sensorData = await getSessionSensorData(
            props.session._id,
            sensor._id
          );
          newData[sensor._id] = sensorData.data;
          if (sensorData.data.length > 0) {
            if (newRange[0] > sensorData.data[0].x)
              newRange[0] = Math.max(0, sensorData.data[0].x / (60 * 100));
            if (newRange[1] < sensorData.data[sensorData.data.length - 1].x)
              newRange[1] = Number(
                (
                  Math.round(
                    (sensorData.data[sensorData.data.length - 1].x /
                      (60 * 100)) *
                      4
                  ) / 4
                ).toFixed(2)
              );
          }
        } catch (e) {
          newData[sensor._id] = [];
        }
      }
      if (
        (newRange[0] === -1 && newRange[1] === -1) ||
        newRange[1] > range[1]
      ) {
        setRange(newRange);
        setInterval([newRange[0] * 60 * 100, newRange[1] * 60 * 100]);
      }
      setFetching(false);
      setData(newData);
    };
    getData(cleanData);
  }, [props.sensors, props.session]);

  useEffect(() => {
    if (!fetching) setChart(createChart(chartId));
    else {
      try {
        chart && chart.dispose();
      } catch (e) {}
    }
  }, [fetching]);

  useEffect(() => {
    if (!lineSeries || lineSeries === {} || !data) return;
    for (const [id, series] of Object.entries(lineSeries)) {
      // @ts-ignore
      series.add(data[id]);
    }
  }, [lineSeries]);

  useEffect(() => {
    if (!data) return;
    for (const [_, series] of Object.entries(lineSeries)) series.dispose();
    setLineSeries(generateLineSeries(chart, props.sensors));
  }, [data]);

  useEffect(() => {
    if (chart)
      chart
        .getDefaultAxisX()
        .setInterval(interval[0], interval[1], false, true);
  }, [interval, chart]);

  const generateLegend = useCallback(() => {
    if (!data) return;
    let legendElements: any = [];
    const generateSensor = (name: string, unit: string) => (
      <div className="legend-item">
        <div className="legend-item-name">{name}</div>&nbsp;
        {unit !== "" && "(" + unit + ")"}
      </div>
    );
    let i = 0;
    for (const sensor of props.sensors) {
      legendElements.push(
        <div
          key={sensor._id}
          className="sensor"
          style={{
            color: colors[i],
            textDecoration:
              data[sensor._id].length === 0 ? "line-through" : "none",
          }}
        >
          {generateSensor(sensor.name, sensor.unit ? sensor.unit : "")}
        </div>
      );
      i++;
    }
    return legendElements;
  }, [data]);

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
      <div className="line-chart">
        <div
          className="line-legend"
          style={{
            gridTemplateColumns: (() => {
              let template = "1fr 1fr";
              let legendCount = Object.keys(lineSeries).length;
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
        <div id={chartId.toString()} className="fill"></div>
        <div className="line-controls">
          <RangeSlider
            title="Interval"
            tipFormatter={(value: any) => `${value / 10} minutes`}
            min={range[0]}
            max={range[1]}
            step={1}
            lowerValue={interval[0]}
            upperValue={interval[1]}
            unit="minutes"
            onChange={(interval: number[]) => {
              setInterval(
                interval.map(
                  // Milliseconds
                  (x) => (x / 10) * 60 * 1000
                )
              );
            }}
          />
        </div>
      </div>
    );
  }
};

const createChart = (chartId: number) => {
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
    .setInterval(0, 1)
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
