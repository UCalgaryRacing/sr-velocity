// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

interface ScatterChartProps {}

export const ScatterChart: React.FC<ScatterChartProps> = (
  props: ScatterChartProps
) => {
  return <div></div>;
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
