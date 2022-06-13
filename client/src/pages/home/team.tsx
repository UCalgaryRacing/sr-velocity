import React from "react";
import "./problem.css";

export default class Team extends React.Component {
  render = () => {
    return (
      <div id="problem">
        <div id="problemStatement">
          <h1 id="theProblem">Brought To You By</h1>
          <img id="logo" src="assets/team-logo.svg" />
          <div
            id="problemDescription"
            style={{
              fontWeight: "600",
              margin: "auto",
              marginTop: "3%",
              maxWidth: 1000,
              paddingLeft: 40,
              paddingRight: 40,
            }}
          >
            <h1
              style={{
                color: "#191919",
                fontSize: "2.5vw",
                marginBottom: "2%",
              }}
            >
              And the largest software sub-team in FSAE.
            </h1>
          </div>
        </div>
      </div>
    );
  };
}
