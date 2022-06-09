// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useState, useContext, useEffect, useCallback } from "react";
import { useWindowSize } from "hooks";
import { DashboardContext } from "../../dashboard";
import { SaveOutlined, Add, CachedOutlined } from "@mui/icons-material";
import { DashboardLoading } from "pages/dashboard/loading";
import {
  IconButton,
  ToolTip,
  DropDown,
  Alert,
  TextButton,
} from "components/interface";
import {
  Sensor,
  Thing,
  Chart,
  ChartPreset,
  RootState,
  isAuthAtLeast,
  UserRole,
  useAppSelector,
} from "state";
import { getChartPresets } from "crud";
import { ChartModal } from "components/modals";
import DashNav from "components/navigation/dashNav";

interface PlotViewProps {
  things: Thing[];
  thing: Thing;
  onThingChange: (thing: Thing) => void;
}

// TODO: Create static and dynamic chart components in the interface folder
// TODO: Create different presets for static vs. dynamic
// TODO: Fetch sessions
// TODO: Fetch sensors

const PlotView: React.FC<PlotViewProps> = (props: PlotViewProps) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);

  const [fetching, setFetching] = useState<boolean>(false);
  const [chartPreset, setChartPreset] = useState<ChartPreset>();
  const [chartPresets, setChartPresets] = useState<ChartPreset[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [alertError, setAlertError] = useState<boolean>(false);
  const [showChartModal, setShowChartModal] = useState<boolean>(false);
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    setFetching(true);
    getChartPresets(props.thing._id)
      .then((presets: ChartPreset[]) => {
        presets.sort((a: ChartPreset, b: ChartPreset) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setChartPresets(presets);
        setFetching(false);
      })
      .catch((_: any) => {
        alert(true, "Could not fetch presets...");
        setFetching(false);
      });
  }, []);

  useEffect(
    () => setCharts(chartPreset ? chartPreset.charts : []),
    [chartPreset]
  );

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const generateCharts = useCallback(() => {
    let chartUI: any = [];
    // for (const chart of charts) {
    //   let sensors: Sensor[] = [];
    //   for (const id of chart.sensorIds)
    //     sensors.push(props.sensors.filter((s) => s._id === id)[0]);
    //   // TODO: Create static chart box
    // }
    return chartUI;
  }, [charts]);

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

  return <div></div>;
};

export default PlotView;
