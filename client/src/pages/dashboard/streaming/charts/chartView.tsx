// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect, useContext } from "react";
import {
  IconButton,
  ToolTip,
  DropDown,
  Alert,
  TextButton,
} from "components/interface";
import { ChartBox } from "components/charts";
import { DashboardContext } from "../../dashboard";
import { SaveOutlined, Add } from "@mui/icons-material";
import {
  Sensor,
  Thing,
  Chart,
  ChartPreset,
  useAppSelector,
  RootState,
  isAuthAtLeast,
  UserRole,
} from "state";
import { getChartPresets } from "crud";
import { ChartModal } from "components/modals";
import { CircularProgress } from "@mui/material";
import DashNav from "components/navigation/dashNav";
import { useWindowSize } from "hooks";
import { ChartPresetModal } from "./modals/chartPresetModal";
import "./_styling/chartView.css";
import { Stream } from "stream/stream";

interface ChartViewProps {
  sensors: Sensor[];
  things: Thing[];
  thing: Thing;
  stream: Stream;
  onThingChange: (thing: Thing) => void;
}

const ChartView: React.FC<ChartViewProps> = (props: ChartViewProps) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [fetchingPresets, setFetchingPresets] = useState<boolean>(false);
  const [chartPreset, setChartPreset] = useState<ChartPreset>();
  const [chartPresets, setChartPresets] = useState<ChartPreset[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showChartModal, setShowChartModal] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [chartUI, setChartUI] = useState<any[]>([]);

  useEffect(() => {
    setFetchingPresets(true);
    getChartPresets(props.thing._id)
      .then((presets: ChartPreset[]) => {
        presets.sort((a: ChartPreset, b: ChartPreset) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setChartPresets(presets);
        setFetchingPresets(false);
      })
      .catch((_: any) => {
        alert(true, "Could not fetch presets...");
        setFetchingPresets(false);
      });
  }, []);

  useEffect(() => {
    if (chartPreset) {
      setCharts(chartPreset.charts);
    } else {
      setCharts([]);
    }
  }, [chartPreset]);

  useEffect(() => {
    generateCharts(charts);
  }, [charts]);

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const generateCharts = (charts: Chart[]) => {
    let chartUI: any = [];
    for (const chart of charts) {
      chartUI.push(
        <ChartBox
          key={chart._id}
          chart={chart}
          allSensors={props.sensors}
          sensors={props.sensors.filter((sensor) =>
            chart.sensorIds.includes(sensor._id)
          )}
          onDelete={onDeleteChart}
          onUpdate={onChartUpdate}
        />
      );
    }
    setChartUI(chartUI);
  };

  const onChartUpdate = (chart: Chart) => {
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
      if (updated) alert(false, "The Chart was updated.");
      else alert(false, "The Chart was created.");
    }
    setShowChartModal(false);
  };

  const onDeleteChart = (chartId: string) => {
    let updatedCharts = [];
    for (let chart of [...charts])
      if (chart._id !== chartId) updatedCharts.push(chart);
    setCharts(updatedCharts);
  };

  const onNewPreset = (preset: ChartPreset) => {
    if (preset && preset._id) {
      let updatedPresets = [...chartPresets];
      let updated = false;
      for (let i in updatedPresets) {
        if (updatedPresets[i]._id === preset._id) {
          updatedPresets[i] = preset;
          updated = true;
        }
      }
      if (!updated) updatedPresets.push(preset);
      updatedPresets.sort((a: ChartPreset, b: ChartPreset) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setChartPresets(updatedPresets);
      setChartPreset(preset);
      if (updated) alert(false, "The Preset was updated.");
      else alert(false, "The Preset was saved.");
    }
    setShowPresetModal(false);
  };

  const onDeletePreset = (presetId: string) => {
    let updatedPresets = [];
    for (const preset of chartPresets)
      if (preset._id !== presetId) updatedPresets.push(preset);
    setChartPresets(updatedPresets);
    setChartPreset(undefined);
    alert(false, "The Preset was deleted.");
  };

  return (
    <>
      {fetchingPresets ? (
        <div id="dashboard-loading">
          <div id="dashboard-loading-content">
            <>
              <CircularProgress style={{ color: "black" }} />
              <br />
              <br />
              <b>Fetching presets...</b>
            </>
          </div>
        </div>
      ) : (
        <>
          <DashNav margin={context.margin}>
            <div className="left">
              {size.width >= 768.9 ? (
                <ToolTip value="New Chart">
                  <IconButton
                    img={<Add />}
                    onClick={() => setShowChartModal(true)}
                  />
                </ToolTip>
              ) : (
                <TextButton
                  title="New Chart"
                  onClick={() => setShowChartModal(true)}
                />
              )}
              {isAuthAtLeast(user, UserRole.MEMBER) && charts.length > 0 && (
                <>
                  {size.width >= 768.9 ? (
                    <ToolTip value="Save Preset">
                      <IconButton
                        img={<SaveOutlined />}
                        onClick={() => setShowPresetModal(true)}
                      />
                    </ToolTip>
                  ) : (
                    <TextButton
                      title="Save Preset"
                      onClick={() => setShowPresetModal(true)}
                    />
                  )}
                </>
              )}
              {chartPresets.length !== 0 && (
                <DropDown
                  placeholder="Select Preset..."
                  options={(() => {
                    let options = [];
                    if (isAuthAtLeast(user, UserRole.MEMBER)) {
                      options.push({
                        value: undefined,
                        label: "New Preset",
                      });
                    }
                    options = options.concat(
                      // @ts-ignore
                      chartPresets.map((preset) => {
                        return { value: preset, label: preset.name };
                      })
                    );
                    return options;
                  })()}
                  onChange={(value: any) => {
                    setChartPreset(
                      value.label === "New Preset" ? undefined : value.value
                    );
                  }}
                  value={
                    chartPreset
                      ? {
                          value: chartPresets.filter(
                            (p) => p._id === chartPreset._id
                          )[0],
                          label: chartPreset.name,
                        }
                      : { value: undefined, label: "New Preset" }
                  }
                  isSearchable
                />
              )}
            </div>
            <div className="right">
              <DropDown
                placeholder="Select Thing..."
                options={props.things.map((thing) => {
                  return { value: thing._id, label: thing.name };
                })}
                onChange={(value: any) => {
                  for (const thing of props.things)
                    if (thing._id === value.value) props.onThingChange(thing);
                }}
                defaultValue={{
                  value: props.thing._id,
                  label: props.thing.name,
                }}
                isSearchable
              />
            </div>
          </DashNav>
          <div id="chart-view">{chartUI}</div>
          {charts.length === 0 && (
            <div id="dashboard-loading">
              <div id="dashboard-loading-content">
                <>
                  <b>
                    No Charts yet.
                    {chartPresets.length > 0
                      ? " Create one or select a preset."
                      : ""}
                  </b>
                  <br />
                  <br />
                  <TextButton
                    title="Add Chart"
                    onClick={() => setShowChartModal(true)}
                  />
                </>
              </div>
            </div>
          )}
        </>
      )}
      {showChartModal && (
        <ChartModal
          show={showChartModal}
          toggle={onChartUpdate}
          sensors={props.sensors}
        />
      )}
      {showPresetModal && (
        <ChartPresetModal
          show={showPresetModal}
          toggle={onNewPreset}
          chartPreset={chartPreset}
          charts={charts}
          thing={props.thing}
          onDelete={onDeletePreset}
        />
      )}
      <Alert
        title={alertError ? "Something went wrong..." : "Success!"}
        description={alertDescription}
        color={alertError ? "red" : "green"}
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};

export default ChartView;
