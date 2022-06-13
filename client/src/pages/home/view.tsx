import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import { TextButton } from "components/interface";
import "./view.css";

export const View: React.FC = () => {
  const customInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div id="view">
      <div id="viewBackground">
        <Particles
          id="ts-particles-3"
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
      <div id="theView">
        <h1 id="ourView">Seeing is Believing</h1>
        <div
          id="viewDescription"
          style={{ marginTop: "3%", fontWeight: "600" }}
        >
          <h1 style={{ color: "#fff", fontSize: "2.5vw", marginBottom: "2%" }}>
            We can't wait to show you our system in action. In the meantime,
            explore our <a href="/sign-in">dashboard.</a>
          </h1>
          <h1
            style={{
              color: "#fff",
              fontSize: "2.5vw",
              marginTop: "5%",
              marginBottom: "2%",
            }}
          >
            If you want the nitty-gritty technical details, or learn about our
            team, explore our&nbsp;
            <a href="/about">about page.</a>
          </h1>
        </div>
      </div>
    </div>
  );
};
