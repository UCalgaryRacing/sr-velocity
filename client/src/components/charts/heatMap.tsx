// import React, {useState, useEffect} from 'react';
// import colormap from '@colormap';
// import Data from './data';
// import SensorData from './constants';
// import ScatterPlot from './scatterPlot';
// import { ColorHEX } from '@arction/lcjs';
// import { Button, ButtonGroup } from 'react-bootstrap';
// import './_styling/heatMap.css';

// const colors = colormap({
//     colormap: 'jet',
//     nshades: 500,
//     format: 'hex',
//     alpha: 1
// });

// type Properties = {
//   currentPoint: any;
// //   category: any;
//   delete: (id: number) => void;
//   index:  number;
// }

// const HeatMap: React.FC<Properties> = (props: Properties) => {

//     let currentPoint = {};
//     let pointSelections = [];
//     // let category = props.category;
//     let selectionUnit = 'km/h';
//     let forceMapUpdate = false;

//     const [data, setData] = useState({
//                 'Throttle Position': [], //0, 100
//                 'Acceleration': [], // sum x + y |0, 2|
//                 'Speed': [] //0, 100
//             });
//     const [indicationColor, setIndicationColor] = useState('#000');
//     const [selection, setSelection] = useState('Speed');

//     useEffect(() =>{
//          pullData();
//     }, [props.currentPoint]);

//     const updateSelectionUnit = (sensor: any[]): void => {
//         SensorData.getInstance((sensorData) => {
//             let s: any = sensorData.filter(item => item.name === 'sensor');
//             selectionUnit = s.output_unit;
//         });
//     }

//     const getColor = (value: number[], boundaries: number[]) => {
//         let range = Math.abs(boundaries[1] - boundaries[0]);
//         let index = (value[0] - boundaries[0]) / range;
//         index = Math.round(index * 500);
//         if (index >= 500) index = 499;
//         return ColorHEX(colors[499 - index]);
//     }

//     const findParamColor = async (sensor: any) => {
//         //Refactor
//         let newValue: any = {};

//         if (sensor === 'Acceleration') {
//             newValue = await Data.getInstance().getDataPoint('X').then(async (xValue:number[]) => {
//                 var yValue = await Data.getInstance().getDataPoint('Y');
//                 return {
//                     val: Math.abs(xValue[0]) + Math.abs(yValue[0]),
//                     col: getColor([yValue], [-1.5, 1.5])
//                 };
//             });
//         }
//         else if (sensor === 'Throttle Position') {
//             newValue.val = await Data.getInstance().getDataPoint('Throttle');
//             newValue.col = getColor(newValue.val, [0, 70]);
//         }
//         else if (sensor === 'Speed') {
//             newValue.val = await Data.getInstance().getDataPoint('Speed');
//             newValue.col = getColor(newValue.val, [0, 40]);
//         }
//         return newValue;
//     }

//     const pullData = async () => {
//         //Refactor, only store current selection in memory
//         if (props.currentPoint === undefined) return;
//         if (forceMapUpdate) forceMapUpdate = false;
//         let temp = props.currentPoint;
//         for (var sensor in data) {
//             var val = await findParamColor(sensor);
//             let point: any = { x: temp.x, y: temp.y };
//             point.color = val.col;
//             point.val = val.val;
//             data[sensor].push(point);
//         }
//         let colArray: any[] = data[selection];
//         temp.color = colArray[colArray.length - 1].color;
//         currentPoint = temp;
//     }

//     const refreshMap = (sensor: any): void => {
//         forceMapUpdate = true;
//         updateSelectionUnit(sensor);
//         setSelection(sensor);
//     }

//     return (
//         <div id='heatMap' style={{ width: '100%' }}>
//             <ScatterPlot
//                 id='scatter'
//                 mapUpdate={forceMapUpdate}
//                 data={data[selection]}
//                 point={currentPoint}
//                 dataTitle={selection}
//                 unit={selectionUnit} />
//             <div style={{ textAlign: 'center', marginBottom: '10px'}}>
//                 <ButtonGroup id='heatMapSelector'>
//                     <Button style={{ width: '120px !important' }} id='customButton' onClick={() => refreshMap('Speed')} disabled={(selection === 'Speed')}><b>Speed</b></Button>
//                     <Button style={{ width: '120px' }} id='customButton' onClick={() => refreshMap('Acceleration')} disabled={(selection === 'Acceleration')}><b>Accel</b></Button>
//                     <Button style={{ width: '120px' }} id='customButton' onClick={() => refreshMap('Throttle Position')} disabled={(selection === 'Throttle Position')}><b>Throttle</b></Button>
//                 </ButtonGroup >
//             </div>
//         </div>
//     );
// }

// export default HeatMap;
export {};
