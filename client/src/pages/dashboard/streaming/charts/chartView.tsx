// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext } from "react";
import { IconButton, ToolTip } from "components/interface";
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
          <ToolTip value="Sensors">
            <IconButton img={<Sensors />} />
          </ToolTip>
          <ToolTip value="New Chart">
            <IconButton img={<Add />} />
          </ToolTip>
          <ToolTip value="Presets">
            <IconButton img={<Category />} />
          </ToolTip>
          <ToolTip value="Save Configuration">
            <IconButton img={<SaveOutlined />} />
          </ToolTip>
        </div>
        <div className="right">
          <ToolTip value="Run a Test">
            <IconButton img={<Air />} />
          </ToolTip>
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
