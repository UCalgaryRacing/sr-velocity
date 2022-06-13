import React from "react";
import { Intro } from "./intro";
import Problem from "./problem";
import { Segway } from "./segway";
import Team from "./team";
import { View } from "./view";
import Social from "./social";
import "./home.css";

const Home: React.FC = () => {
  return (
    <div id="home">
      <Intro />
      <Problem />
      <Segway />
      <Team />
      <View />
      <Social />
    </div>
  );
};

export default Home;
