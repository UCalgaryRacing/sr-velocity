// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useRef } from "react";
import { Stream } from "stream/stream";
import { Sensor } from "state";
import { ToolTip } from "components/interface";
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

// TODO: Just make this as a heatmap
export const ScatterChart: React.FC<ScatterChartProps> = (
  props: ScatterChartProps
) => {
  // Stream subscriptions
  const [dataSubId, setDataSubId] = useState<string>("");
  const dataCallbackRef = useRef<(data: any, timestamp: number) => void>(null);
  const [dataUpdateSubId, setDataUpdateSubId] = useState<string>("");
  const missingDataCallbackRef = useRef<() => void>(null);
  const [connectionSubId, setConnectionSubId] = useState<string>("");
  const connectionCallbackRef = useRef<() => void>(null);

  // Control state
  const [connected, setConnected] = useState<boolean>(false);
  const [heatSensor, setHeatSensor] = useState<Sensor>();

  // Chart state
  const [chartId, _] = useState<number>(Math.trunc(Math.random() * 100000));
  const [chart, setChart] = useState<any>();
  const [pointSeries, setPointSeries] = useState<any>();
  const [lastValues, setLastValues] = useState<{
    [key: number]: { [k1: string]: number };
  }>(
    (() => {
      let last: any = {};
      for (const sensor of props.sensors)
        last[sensor.smallId] = { value: 0, slope: 0 };
      return last;
    })()
  );

  useEffect(() => setChart(createChart(chartId)), []);

  useEffect(() => {
    if (!chart) return;
    initializePointSeries();
    // TODO: Connect subscribers
    return () => {
      try {
        chart && chart.dispose();
      } catch (e) {}
    };
  }, [chart]);

  useEffect(() => {
    // Resubscribe with the new sensor
    // Get all previous data for the heat sensor
    // Clear point series and populate new data with write colors
  }, [heatSensor]);

  const initializePointSeries = () => {
    if (pointSeries) pointSeries.dispose();
    setPointSeries(generatePointSeries(chart));
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
            lastValues[sensor.smallId]["value"],
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
  };

  const onData = (data: { [key: string]: number }, timestamp: number) => {
    if (!data) return;
    for (const sensor of props.sensors) {
      if (data[sensor.smallId] && pointSeries) {
        // TODO
      }
    }
  };

  const onUpdatedData = () => {
    // TODO
  };

  return <div></div>;
};

const createChart = (chartId: number) => {
  // Create the chart
  let chart = lightningChart()
    .ChartXY()
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
