// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useContext, useEffect } from "react";
import { IconButton, ToolTip } from "components/interface";
import { DashboardContext } from "../../dashboard";
import DashNav from "components/navigation/dashNav";
import { SaveOutlined, Add, Air, Category } from "@mui/icons-material";
import "./_styling/rawDataView.css";

const RawDataView: React.FC = () => {
  const [boxes, setBoxes] = useState<any[]>([]);
  const context = useContext(DashboardContext);

  useEffect(() => {
    generateBoxes();
  }, []);

  const generateBoxes = () => {
    let boxUI: any[] = [];
    setBoxes(boxUI);
  };

  return (
    <div id="raw-data-view">
      <DashNav margin={context.margin}>
        <div className="left">
          <ToolTip value="New Card">
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
      {boxes}
    </div>
  );
};

export default RawDataView;
