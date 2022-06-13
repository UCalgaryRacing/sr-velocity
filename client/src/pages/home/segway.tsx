import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import "./segway.css";

export const Segway: React.FC = () => {
  const customInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div id="solution">
      <div id="solutionBackground">
        <Particles
          id="ts-particles-2"
          init={customInit}
          options={{
            fullScreen: {
              enable: true,
              zIndex: 100,
            },
            particles: {
              number: {
                value: 40,
                density: {
                  enable: true,
                },
              },
              color: {
                value: "#ffffff",
              },
              shape: {
                type: "point",
                stroke: {
                  color: "#000000",
                  width: 100,
                },
              },
              opacity: {
                value: 0.5,
                random: true,
                anim: {
                  enable: false,
                },
              },
              line_linked: {
                enable: true,
                distance: 300,
                color: "#ffffff",
                opacity: 0.7,
              },
              move: {
                enable: true,
                speed: 0.2,
              },
            },
            retina_detect: true,
            fps_limit: 30,
          }}
        />
      </div>
      <div id="theSolution">
        <h1 id="ourSolution">Centralized Data</h1>
        <div
          id="solutionDescription"
          style={{ marginTop: "3%", fontWeight: "600" }}
        >
          <h1 style={{ color: "#fff", fontSize: "2.5vw", marginBottom: "2%" }}>
            Our Sensor-Thing-Operator API is built for developers to make their
            own applications, or use our highly customizable GUI.
          </h1>
          <h1
            style={{
              color: "#fff",
              fontSize: "2.5vw",
              marginBottom: "2%",
              marginLeft: "5%",
              marginRight: "5%",
            }}
          >
            We collect only the data you need, at any frequency, with any
            sensors, for any thing, with any users, all available at your
            fingertips.
          </h1>
          <h1 style={{ color: "#fff", fontSize: "2.5vw", marginBottom: "2%" }}>
            Finally, we eliminate paper with a data annotation.
          </h1>
        </div>
      </div>
    </div>
  );
};
