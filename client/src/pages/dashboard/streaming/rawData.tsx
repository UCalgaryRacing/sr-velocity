import React from "react";
import { Card } from "react-bootstrap";
import RawBox from "./rawBox";

// const testSensors = [
//   {
//     name: "Sensor Uno",
//     value: 1,
//   },
//   {
//     name: "Sensor Dos",
//     value: 2,
//   },
//   {
//     name: "Sensor Tres",
//     value: 3,
//   },
//   {
//     name: "Sensor Cuatro",
//     value: 4,
//   },
// ];

const RawData: React.FC = () => {
  const testSensors = [
    { name: "Sensor Uno", value: 1 },
    { name: "Sensor Dos", value: 2 },
    { name: "Sensor Tres", value: 3 },
    { name: "Sensor Cuatro", value: 4 },
  ];

  // const renderCard = (sensor: any) => {
  //   return (
  //     // <Card style={{ width: "18rem" }} key={testSensor.value}>
  //     //   <Card.Body>
  //     //     <Card.Title>{testSensor.name}</Card.Title>
  //     //     <Card.Text>{testSensor.value}</Card.Text>
  //     //   </Card.Body>
  //     // </Card>
  //   );
  // };

  return (
    <div className="raw-data">
      {testSensors.map((sensor) => {
        return <RawBox sensor={sensor} />;
      })}
    </div>
  );
};

export default RawData;

// const obj = [
//   {
//     name: "x",
//     value: 1,
//   },
// ]

// create a component
// create a list of test sensors, (array of objects)
// map this list of test sensors to jsx
// For each sensor, assign a new random value every 1 second
// The boxes should grow horizonatally and wrap vertically
// Have a title for each box
// The value for each box should be between x and y, where x and y are random, and they are different for each
// Then use the current value to change the color of the box, if x/y < 33%, 33% < x/y < 66%: green, otherwise red
