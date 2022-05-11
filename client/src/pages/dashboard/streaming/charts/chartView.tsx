// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useContext } from "react";
import { IconButton, ToolTip, DropDown, Alert } from "components/interface";
import { ChartBox, ChartType } from "components/charts/";
import { DashboardContext } from "../../dashboard";
import { SaveOutlined, Add, Air, Category } from "@mui/icons-material";
import { Sensor, Thing, Chart, ChartPreset } from "state";
import { NewChartModal } from "./modals/newChart";
import { getChartPresets } from "crud/chartPresets";
import DashNav from "components/navigation/dashNav";
import "./_styling/chartView.css";

interface ChartViewProps {
  sensors: Sensor[];
  things: Thing[];
  thing: Thing;
  onThingChange: (thing: Thing) => void;
}

const ChartView: React.FC<ChartViewProps> = (props: ChartViewProps) => {
  const context = useContext(DashboardContext);
  const [chartPreset, setChartPreset] = useState<ChartPreset>();
  const [chartPresets, setChartPresets] = useState<ChartPreset[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [chartUI, setChartUI] = useState<any[]>([]);
  const [noCharts, setNoCharts] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showNewChartModal, setShowNewChartModal] = useState<boolean>(false);

  useEffect(() => {
    getChartPresets(props.thing._id)
      .then((presets: ChartPreset[]) => {
        setChartPresets(presets);
        // Ask to select or create new
      })
      .catch((_: any) => {
        // TODO
      });
  }, []);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateCharts = () => {
    let chartUI: any = [];
    setCharts(chartUI);
  };

  const onChartUpdate = (chart: Chart) => {
    // TODO: Ensure the chart name is unique.
    if (chart && chart._id) {
      let updatedCharts = [...charts];
      let updated = false;
      for (let i in updatedCharts) {
        if (updatedCharts[i].name === chart.name) {
          updatedCharts[i] = chart;
          updated = true;
        }
      }
      if (!updated) updatedCharts.push(chart);
      updatedCharts.sort((a: Chart, b: Chart) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setCharts(updatedCharts);
      setNoCharts(false);
      if (updated) alert("The Chart was updated.");
      else alert("The Chart was created");
    }
    setShowNewChartModal(false);
  };

  const onDeleteChart = () => {
    // TODO
  };

  return (
    <>
      <>
        <DashNav margin={context.margin}>
          <div className="left">
            <ToolTip value="New Chart">
              <IconButton
                img={<Add />}
                onClick={() => setShowNewChartModal(true)}
              />
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
            <DropDown
              placeholder="Select Thing..."
              options={props.things.map((thing) => {
                return { value: thing._id, label: thing.name };
              })}
              onChange={(value: any) => {
                for (const thing of props.things)
                  if (thing._id === value.value) props.onThingChange(thing);
              }}
              defaultValue={{ value: props.thing._id, label: props.thing.name }}
              isSearchable
            />
          </div>
        </DashNav>
        <div id="chart-view">{charts}</div>
      </>
      <NewChartModal
        show={showNewChartModal}
        toggle={onChartUpdate}
        sensors={props.sensors}
      />
      <Alert
        title="Success!"
        description={alertDescription}
        color="green"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};

export default ChartView;
