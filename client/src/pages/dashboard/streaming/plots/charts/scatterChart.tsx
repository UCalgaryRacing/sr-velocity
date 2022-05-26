// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef } from "react";
import { Stream } from "stream/stream";
import { Sensor, sensorTypes } from "state";
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
  // TODO: Have last values for pushing data, and another last values for the legend

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

  const generateLegend = () => {
    if (!lastValues || lastValues === {}) return;
    let legendElements: any = [];
    const generateSensor = (name: string, value: number, unit: string) => (
      <div>
        {name + ": " + value.toFixed(2).replace(/[.,]00$/, "") + " " + unit}
      </div>
    );
    let i = 0;
    for (const sensor of [...props.sensors, heatSensor]) {
      if (!sensor) continue;
      legendElements.push(
        <div
          key={sensor.smallId}
          className="sensor"
          style={{ color: colors[i] }}
        >
          {generateSensor(
            sensor.name,
            lastValues[sensor.smallId],
            sensor.unit ? sensor.unit : ""
          )}
        </div>
      );
      i++;
    }
    return legendElements;
  };

  const onConnection = () => {
    if (pointSeries) pointSeries.clear();
    setLastValues({});
    // Set streaming?
  };

  const onData = (data: { [key: string]: number }, _: number) => {
    if (!data) return;
    let last = { ...lastValues };
    let xSmallId = props.sensors[0].smallId;
    let ySmallId = props.sensors[1].smallId;
    let xData = data[xSmallId];
    let yData = data[ySmallId];
    let heatData = heatSensor ? data[heatSensor.smallId] : undefined;
    if (xData) last[xSmallId] = xData;
    if (yData) last[ySmallId] = yData;
    if (heatData && heatSensor) last[heatSensor.smallId] = heatData;
    if (last[xSmallId] && last[ySmallId]) {
      // TODO: If heat sensor, add color
      pointSeries.add({
        x: last[xSmallId],
        y: last[ySmallId],
      });
    }
    setLastValues(last);
  };

  const onUpdatedData = () => {
    if (pointSeries) pointSeries.clear();
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
        // TODO, fill with heatmap data
        points.push({ x: xData[i], y: yData[i], color: "#000" });
      }
    } else {
      for (let i = 0; i < xData.length; i++)
        points.push({ x: xData[i], y: yData[i] });
    }
    if (pointSeries) pointSeries.add(points);
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
      .setLabelPadding(-10);

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
    .setPointSize(20)
    .setPointFillStyle(individualStyle);
  return series;
};

const fillData = (a: any[], b: any[]) => {
  let filled: any[] = [];
  let longerData = a.length >= b.length ? a : b;
  let shorterData = a.length >= b.length ? b : a;
  let j = 0;
  for (let i = 0; i < longerData.length; i++) {
    if (j >= shorterData.length) break;
    filled.push(shorterData[j]);
    if (longerData[i].x === shorterData[j].x) j++;
  }
  a = a.length >= b.length ? longerData : filled;
  b = a.length >= b.length ? filled : longerData;
  return [a, b];
};

const getDataRate = (sensors: Sensor[]) => {
  let highest_frequency = 0;
  for (const sensor of sensors)
    if (sensor["frequency"] > highest_frequency)
      highest_frequency = sensor["frequency"];
  return Math.ceil(1000 / Math.min(highest_frequency, 30));
};

// import React, { useEffect } from "react";
// import {
//   ColorRGBA,
//   IndividualPointFill,
//   PointShape,
//   lightningChart,
//   emptyTick,
//   AxisScrollStrategies,
//   SolidFill,
//   ColorHEX,
//   AutoCursorModes,
//   SolidLine,
//   FontSettings,
// } from "@arction/lcjs";

// const theme = {
//   whiteFill: new SolidFill({ color: ColorHEX("#FFFFFF") }),
//   lightGrayFill: new SolidFill({ color: ColorHEX("#A0A0A0A0") }),
//   darkFill: new SolidFill({ color: ColorHEX("#505050") }),
// };

// type Properties = {
//   data: any[];
//   mapUpdate: any;
//   point: any;
//   id: string;
//   dataTitle: string;
//   unit: string;
// };

// const ScatterPlot: React.FC<Properties> = (props: Properties) => {
//   // let chartId: number = Math.trunc(Math.random() * 100000);
//   let i: number = 0;
//   let setupComplete: boolean = false;
//   let padding: number = 0;
//   let zero: boolean = false;
//   let pointSeries: any = null;
//   let individualStyle: any = null;
//   let chart: any = null;
//   let zeroX: number = 0;
//   let zeroY: number = 0;
//   let zerp: boolean = false;

//   useEffect(() => {
//     createChart();
//     return () => {
//       chart.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     addData();
//   });

//   const createChart = (): void => {
//     //Set up chart
//     chart = lightningChart()
//       .ChartXY()
//       .setBackgroundFillStyle(theme.whiteFill)
//       .setSeriesBackgroundFillStyle(theme.whiteFill);
//     pointSeries = chart.addPointSeries({ pointShape: PointShape.Circle });
//     individualStyle = new IndividualPointFill();
//     individualStyle.setFallbackColor(ColorRGBA(0, 0, 0, 255));
//     pointSeries
//       .setPointSize(20.0)
//       .setPointFillStyle(individualStyle)
//       .setMouseInteractions(false);
//     chart
//       .setMouseInteractions(false)
//       .setMouseInteractionWheelZoom(false)
//       .setMouseInteractionPan(false)
//       .setMouseInteractionRectangleFit(false)
//       .setMouseInteractionRectangleZoom(false)
//       .setMouseInteractionsWhileScrolling(false)
//       .setMouseInteractionsWhileZooming(false);
//     chart
//       .getDefaultAxisX()
//       .setScrollStrategy(AxisScrollStrategies.fitting)
//       .setTickStyle(emptyTick)
//       .setMouseInteractions(false)
//       .setStrokeStyle(
//         new SolidLine({
//           thickness: 3,
//           fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
//         })
//       );
//     chart
//       .getDefaultAxisY()
//       .setScrollStrategy(AxisScrollStrategies.fitting)
//       .setMouseInteractions(false)
//       .setTickStyle(emptyTick)
//       .setStrokeStyle(
//         new SolidLine({
//           thickness: 3,
//           fillStyle: new SolidFill({ color: ColorHEX("#C8C8C8") }),
//         })
//       );
//     // TODO: Need to show cursor with current value the heatmap
//     let autoCursor = chart.getAutoCursor();
//     autoCursor.setGridStrokeXStyle(
//       new SolidLine({
//         thickness: 1,
//         fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
//       })
//     );
//     autoCursor.setGridStrokeYStyle(
//       new SolidLine({
//         thickness: 1,
//         fillStyle: new SolidFill({ color: ColorHEX("#C22D2D") }),
//       })
//     );
//     autoCursor.getPointMarker().setSize(0);
//     autoCursor.disposeTickMarkerX();
//     autoCursor.disposeTickMarkerY();
//     var font = new FontSettings({});
//     font = font.setFamily("helvetica");
//     font = font.setWeight("bold");
//     autoCursor.getResultTable().setFont(font);
//     autoCursor
//       .getResultTable()
//       .setTextFillStyle(new SolidFill({ color: ColorHEX("#FFF") }));
//     autoCursor
//       .getResultTable()
//       .getBackground()
//       .setFillStyle(new SolidFill({ color: ColorHEX("#C22D2D") }));
//     pointSeries.setCursorEnabled(false);
//     //Don't allow scrolling
//     chart.engine.container.onwheel = null;
//     chart.engine.container.ontouchstart = null;
//     chart.engine.container.ontouchmove = null;
//     setupComplete = true;
//   };

//   const addData = (): void => {
//     //Need to get value for autocursor somehow
//     if (setupComplete) {
//       if (props.mapUpdate) {
//         pointSeries.clear();
//         for (var point of props.data) {
//           addPoint(point);
//         }
//       } else {
//         addPoint(props.point);
//       }
//     }
//   };

//   const addPoint = (arg: any) => {
//     if (arg === undefined) return;
//     let point: any = {};
//     point.x = arg.x;
//     point.y = arg.y;
//     point.color = arg.color;
//     if (!point.x || !point.y) return;
//     if (!zero) {
//       zeroX = point.x * 1000;
//       zeroY = point.y * 1000;
//       zero = true;
//       return;
//     }
//     point.x *= 1000;
//     point.x -= zeroX;
//     point.y *= 1000;
//     point.y -= zeroY;
//     pointSeries.add(point);
//   };

//   return (
//     <div id="scatter" style={{ marginBottom: "20px" }}>
//       <div
//         /*id={chartId}*/ className="fill"
//         onWheel={(event) => {
//           return true;
//         }}
//       ></div>
//     </div>
//   );
// };

// export default ScatterPlot;
