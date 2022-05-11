// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { IconButton, ToolTip, RangeSlider } from "components/interface";
import { Heatmap, LineChart, RadialChart, ScatterChart } from "./";
import { Sensor } from "state";
import { CloseOutlined, Edit } from "@mui/icons-material";
import "./_styling/chartBox.css";

export enum ChartType {
  HEATMAP = "Heat Map",
  LINE = "Line",
  RADIAL = "Radial",
  SCATTER = "Scatter",
}

interface ChartBoxProps {
  title: string;
  type: ChartType;
  realtime: boolean;
  sensors: Sensor[];
}

export const ChartBox: React.FC<ChartBoxProps> = (props: ChartBoxProps) => {
  return (
    <div className="chart-box">
      <div className="chart-title">{props.title}</div>
      <div className="chart-controls">
        <ToolTip value="Edit Chart">
          <IconButton img={<Edit />} />
        </ToolTip>
        <ToolTip value="Close">
          <IconButton img={<CloseOutlined />} />
        </ToolTip>
      </div>
      <div className="chart-area">
        {(() => {
          switch (props.type) {
            case ChartType.HEATMAP:
              return <Heatmap />;
            case ChartType.LINE:
              return <LineChart />;
            case ChartType.RADIAL:
              return <RadialChart />;
            case ChartType.SCATTER:
              return <ScatterChart />;
            default:
              return <LineChart />;
          }
        })()}
      </div>
    </div>
  );
};

// import React, { useState, useEffect } from "react";
// import LineChart from "../../lineChart";
// import HeatMap from "./heatMap";
// import { Button } from "react-bootstrap";
// import { Slider } from "@material-ui/core";
// import { withStyles } from "@material-ui/core/styles";
// import Data from "../../data";
// import "./graphBox.css";
// import savitzkyGolay from "ml-savitzky-golay";

// type Properties = {
//   sensors: any[];
//   title: string;
//   id: number;
//   delete: (id: number) => void;
//   hideClose: boolean;
// };

// const GraphBox: React.FC<Properties> = (props: Properties) => {
//   const RangeSlider = withStyles({
//     root: {
//       color: "#C22E2D",
//     },
//     thumb: {
//       boxShadow:
//         "0 0px 0px rgba(0,0,0,0),0 0px 0px rgba(0,0,0,0),0 0 0 0px rgba(0,0,0,0)",
//       "&:focus,&:hover,&$active": {
//         boxShadow:
//           "0 0px 0px rgba(0,0,0,0),0 0px 0px rgba(0,0,0,0),0 0 0 0px rgba(0,0,0,0)",
//         "@media (hover: none)": {
//           boxShadow:
//             "0 0px 0px rgba(0,0,0,0),0 0px 0px rgba(0,0,0,0),0 0 0 1px rgba(0,0,0,0)",
//         },
//       },
//     },
//   })(Slider);

//   let chart: any = React.createRef();
//   const [currentRange, setCurrentRange] = useState([0, 0.5]);
//   const [indicationColour, setIndicationColour] = useState("#000");
//   const [updatingRange, setUpdatingRange] = useState(false);
//   const [updatingTitles, setUpdatingTitles] = useState(false);
//   const [updatingGrid, setUpdatingGrid] = useState(false);
//   const [sensors, setSensors] = useState(props.sensors);
//   const [window, setWindow] = useState(5);
//   const [data, setData] = useState();

//   // state = {
//   //     currentRange: 0.5,
//   //     indicationColour: '#000',
//   //     updatingRange: false,
//   //     updatingTitles: false,
//   //     updatingGrid: false,
//   //     sensors: props.sensors,
//   //     window: 5, // Default window size for smoothing
//   // }
//   let dxdtParentIndices: any[] = [];
//   let index: number = 0;

//   useEffect(() => {
//     document.addEventListener("gotData", () => {
//       pullData();
//     });

//     return () => {
//       document.removeEventListener("gotData", () => {
//         pullData();
//       });
//     };
//   }, []);

//   const pullData = (): void => {
//     let newDatasets: Promise<any>;
//     if (props.sensors[0].category !== "Track Map")
//       newDatasets = Data.getInstance().get(props.sensors[0].category);
//     else newDatasets = Data.getInstance().getDataPoint("Track Map");
//     newDatasets.then((newDatasets1) => {
//       if (newDatasets1 === undefined) return;
//       if (props.title === "Track Map") setData(newDatasets1);
//       else {
//         let newColour: string;
//         if (newDatasets1.length === undefined)
//           newColour = updateColours(newDatasets1);
//         else {
//           if (newDatasets1[0] === undefined) return;
//           newColour = updateColours(newDatasets1[0]);
//         }
//         updateDerivative();
//         setData(newDatasets1);
//         setIndicationColour(newColour);
//         setUpdatingRange(false);
//         setUpdatingTitles(false);
//       }
//       index++;
//     });
//   };

//   const smoothenData = (dataSet: number[], h: number, dx: boolean): any => {
//     var options = {
//       derivative: dx ? 1 : 0,
//       windowSize: window,
//       polynomial: 2,
//       pad: "pre",
//       padValue: "replicate",
//     };
//     return savitzkyGolay(dataSet, h, options);
//   };

//   const createDerivative = (parentIndex: any, sensor: any): void => {
//     dxdtParentIndices.push(parentIndex);
//     Data.getInstance()
//       .getAllData(sensor)
//       .then((data1: number[]) => {
//         data1 = smoothenData(data1, 1, false);
//         let dx = smoothenData(data1, 0.1, true);
//         chart.current.addDerivativeSeries(dx, sensor + "'");
//         setSensors((oldArray) => [
//           ...oldArray,
//           {
//             derivative: true,
//             name: sensor + "'",
//             parent: sensor,
//             output_unit:
//               props.sensors[0].output_unit.trim() !== ""
//                 ? props.sensors[0].output_unit + "/sec"
//                 : props.sensors[0].output_unit,
//           },
//         ]);
//         setUpdatingTitles(true);
//       });
//   };

//   const removeDerivative = (parentIndex: number, sensor: any): void => {
//     const index = dxdtParentIndices.indexOf(parentIndex);
//     dxdtParentIndices.splice(index, 1);
//     let name = props.sensors[parentIndex].name + "'";
//     chart.current.removeSeries(name, parentIndex);
//     setSensors((oldSensors) =>
//       oldSensors.filter((element) => element.name !== sensor + "'")
//     );
//     setUpdatingTitles(true);
//   };

//   const controlDerivative = (sensor: any): void => {
//     const parentIndex = props.sensors.findIndex((item) => item.name === sensor);
//     if (dxdtParentIndices.includes(parentIndex))
//       removeDerivative(parentIndex, sensor);
//     else createDerivative(parentIndex, sensor);
//   };

//   const updateDerivative = async (): Promise<any> => {
//     for (var i in dxdtParentIndices) {
//       const sensor = props.sensors[dxdtParentIndices[i]].name;
//       await Data.getInstance()
//         .getAllData(sensor)
//         .then((data1: number[]) => {
//           data1 = smoothenData(data1, 1, false);
//           let dx = smoothenData(data1, 0.1, true);
//           const name = props.sensors[dxdtParentIndices[i]].name + "'";
//           if (chart.current !== null)
//             chart.current.addDerivativeSeries(dx, name);
//         });
//     }
//   };

//   const updateColours = (value: number): string => {
//     //#C22D2d = Red
//     //#BDA800 = Yellow
//     //Refactor, use this.props.sensors, bound for yellow and red are defined
//     if (props.title === "Air To Fuel") {
//       if (value <= 10.5 || value >= 16) {
//         return "#C22D2D";
//       } else if (
//         (value > 10.5 && value < 11.5) ||
//         (value > 14.7 && value < 16)
//       ) {
//         return "#BDA800";
//       }
//     } else if (props.title === "Engine Temperature") {
//       if (value >= 120) return "#C22D2D";
//       else if (value > 105 && value < 120) {
//         return "#BDA800";
//       }
//     } else if (props.title === "Oil Temperature") {
//       if (value > 125) return "#C22D2D";
//       else if (value > 110 && value <= 125) {
//         return "#BDA800";
//       }
//     } else if (props.title === "Oil Pressure") {
//       if (value <= 10) return "#C22D2D";
//     }
//     return "#000";
//   };

//   const handleRangeChange = (event: any, value: number[]): void => {
//     if (value !== currentRange) {
//       setCurrentRange(value);
//       setUpdatingRange(true);
//       chart.current.changeInterval(value[0] * 60 * 10, value[1] * 60 * 10);
//     }
//   };

//   const handleWindowChange = async (event: any, value: number) => {
//     if (value !== window && value < index / 4) {
//       for (var i in dxdtParentIndices) {
//         const sensor = props.sensors[dxdtParentIndices[i]].name;
//         await Data.getInstance()
//           .getAllData(sensor)
//           .then((data: number[]) => {
//             data = smoothenData(data, 1, false);
//             let dx = smoothenData(data, 0.1, true);
//             const name = props.sensors[dxdtParentIndices[i]].name + "'";
//             chart.current.addDerivativeSeries(dx, name);
//           });
//       }
//       setWindow(value);
//     }
//   };

//   const toggleGrid = (): void => {
//     chart.current.toggleGrid();
//   };

//   const toggleRightAxis = (): void => {
//     chart.current.toggleRightAxis();
//   };

//   if (sensors[0].category === "Track Map") {
//     return (
//       <div id="graphBox">
//         <p id="graphTitle">
//           <b>{"Track Map"}</b>
//         </p>
//         <HeatMap currentPoint={data} delete={props.delete} index={props.id} />
//         {!props.hideClose ? (
//           <Button
//             id="deleteGraph"
//             onClick={() => props.delete(props.id)}
//             style={{ position: "absolute" }}
//           >
//             <img
//               id="logoImg"
//               style={{ marginTop: "2px" }}
//               src={require("../../../assets/delete-x.svg")}
//             />
//           </Button>
//         ) : null}
//       </div>
//     );
//   } else {
//     return (
//       <div id="graphBox" style={{ borderColor: indicationColour }}>
//         <p id="graphTitle" style={{ height: "30px" }}>
//           <div style={{ paddingTop: "3.5px", paddingBottom: "3.5px" }}>
//             <b style={{ color: indicationColour }}>
//               {props.sensors[0].category}
//             </b>
//           </div>
//         </p>
//         <div style={{ marginBottom: "10px" }}>
//           <LineChart
//             id={props.id}
//             data={data}
//             sensors={sensors}
//             updatingRange={updatingRange}
//             updatingTitles={updatingTitles}
//             updatingGrid={updatingGrid}
//             controlDerivative={controlDerivative}
//             ref={chart}
//           />
//         </div>
//         <div id="graphBottom" style={{ width: "50%", margin: "auto" }}>
//           <Button
//             id="toggleAxis"
//             onClick={toggleRightAxis}
//             style={{ position: "absolute" }}
//           >
//             <img
//               id="logoImg"
//               style={{
//                 width: "26px",
//                 marginTop: "-11px",
//                 marginLeft: "-12px",
//                 position: "absolute",
//               }}
//               src={require("../../../assets/rightAxis.svg")}
//             />
//           </Button>
//           <Button
//             id="toggleGrid"
//             onClick={toggleGrid}
//             style={{ position: "absolute" }}
//           >
//             <img
//               id="logoImg"
//               style={{
//                 width: "23px",
//                 marginTop: "-11.5px",
//                 marginLeft: "-12.5px",
//                 position: "absolute",
//               }}
//               src={require("../../../assets/grid.svg")}
//             />
//           </Button>
//           <RangeSlider
//             defaultValue={[0, 0.5]}
//             onChangeCommitted={handleRangeChange}
//             marks={true}
//             aria-labelledby="discrete-slider"
//             valueLabelDisplay="on"
//             step={0.5}
//             min={0}
//             max={10}
//             valueLabelFormat={(x) => {
//               return x.toFixed(1);
//             }}
//           />
//           <p
//             style={{
//               textAlign: "center",
//               marginBottom: "20px",
//               zIndex: "1000",
//             }}
//           >
//             <b>Data Range (minutes)</b>
//           </p>
//           <div style={{ display: dxdtParentIndices.length > 0 ? "" : "none" }}>
//             <RangeSlider
//               defaultValue={[5]}
//               onChange={handleWindowChange}
//               marks={false}
//               aria-labelledby="discrete-slider"
//               valueLabelDisplay="on"
//               step={2}
//               min={5}
//               max={255}
//               valueLabelFormat={(x) => {
//                 return x.toFixed(1);
//               }}
//             />
//             <p style={{ textAlign: "center", marginBottom: "25px" }}>
//               <b>Smoothing Factor</b>
//             </p>
//           </div>
//           <Button
//             id="deleteGraph"
//             onClick={() => props.delete(props.id)}
//             style={{ position: "absolute" }}
//           >
//             <img
//               id="logoImg"
//               style={{ marginTop: "2px" }}
//               src={require("../../../assets/delete-x.svg")}
//             />
//           </Button>
//         </div>
//       </div>
//     );
//   }
// };

// export default GraphBox;
