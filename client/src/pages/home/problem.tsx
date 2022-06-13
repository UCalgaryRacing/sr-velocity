import React from "react";
import "./problem.css";

export default class Problem extends React.Component {
  render = () => {
    return (
      <div id="problem">
        <div id="problemStatement">
          <h1 id="theProblem">FSAE, and Beyond</h1>
          <div
            id="problemDescription"
            style={{
              fontWeight: "600",
              margin: "auto",
              marginTop: "3%",
              maxWidth: 1600,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginBottom: "2%",
              }}
            >
              A telemetry system designed to work with a toaster, car, or
              factory.
            </h1>
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginTop: "4vw",
                marginBottom: "2%",
              }}
            >
              Our custom protocol cuts vehicle data transmission costs by:
            </h1>
            <h1
              style={{
                display: "inline-block",
                fontSize: "4vw",
                fontWeight: "800",
                color: "#191919",
                marginBottom: 20,
              }}
            >
              90%
            </h1>
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginBottom: "2%",
              }}
            >
              SR Velocity reduces vehicle data acquisition time by:
            </h1>
            <h1
              style={{
                display: "inline-block",
                fontSize: "4vw",
                fontWeight: "800",
                color: "#191919",
                marginBottom: 20,
              }}
            >
              3,000%
            </h1>
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginBottom: "2%",
              }}
            >
              We can achieve a latency:
            </h1>
            <h1
              style={{
                display: "inline-block",
                fontSize: "4vw",
                fontWeight: "800",
                color: "#191919",
                marginBottom: 20,
              }}
            >
              {"<400ms"}
            </h1>
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginBottom: "2%",
              }}
            >
              Data can be streamed concurrently from ANY connected device
              worldwide and is made available via API.
            </h1>
          </div>
        </div>
      </div>
    );
  };
}
