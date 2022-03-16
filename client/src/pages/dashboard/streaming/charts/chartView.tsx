// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { IconButton } from "components/interface";
import { ChartBox, ChartType } from "components/charts/";
import { DashboardContext } from "../../dashboard";
import { Sensors, SaveOutlined, Add, Air, Category } from "@mui/icons-material";
import DashNav from "components/navigation/dashNav";
import "./_styling/chartView.css";

const ChartView: React.FC = () => {
  const context = useContext(DashboardContext);

  return (
    <div id="chart-view">
      <DashNav margin={context.margin}>
        <div className="left">
          <IconButton img={<Sensors />} />
          <IconButton img={<Add />} />
          <IconButton img={<Category />} />
          <IconButton img={<SaveOutlined />} />
        </div>
        <div className="right">
          <IconButton img={<Air />} />
        </div>
      </DashNav>
      <ChartBox
        title={"This is a custom chart title"}
        type={ChartType.LINE}
        realtime
      />
      <ChartBox title={"Title"} type={ChartType.LINE} realtime />
    </div>
  );
};

export default ChartView;
