import React from "react";

import "./licenses.css";
import licenses from "./licenses.json";

const Licenses: React.FC = () => {
  return (
    <div id="licenses">
      <h1>Licenses</h1>
      {licenses.map((data, key) => {
        return (
          <div key={key} className="license-entry" id="license">
            <h4>{data.name}</h4>
            <p>
              {data.copyright}
              <br></br>
              <a href={data.repository}>{data.licenses}</a>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Licenses;
