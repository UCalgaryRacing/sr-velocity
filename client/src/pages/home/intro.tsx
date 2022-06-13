import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import "./intro.css";

export const Intro: React.FC = () => {
  const customInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div id="intro">
      <div id="shape">
        <Particles
          init={customInit}
          options={{
            fullScreen: {
              enable: true,
              zIndex: 0,
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
      <div
        style={{
          width: "100%",
          position: "absolute",
          top: "0",
          textAlign: "center",
        }}
      >
        <img
          src="./ProtoMe.svg"
          id="logo"
          style={{
            position: "relative",
            top: "0px",
            width: "45vw",
            minWidth: "160px",
          }}
        />
      </div>
      <div id="wrapper">
        <div id="content">
          <h1>
            <span id="firstText">low cost, real-time, </span>
            <span id="secondText">generic, plug-n-play,</span>
            <span id="thirdText">visualizable</span>
            <span id="subText">Telemetry.</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
