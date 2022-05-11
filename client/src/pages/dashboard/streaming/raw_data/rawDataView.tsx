// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useContext, useEffect } from "react";
import {
  IconButton,
  ToolTip,
  DropDown,
  Alert,
  TextButton,
} from "components/interface";
import { DashboardContext } from "../../dashboard";
import DashNav from "components/navigation/dashNav";
import { SaveOutlined, Add, Air } from "@mui/icons-material";
import { RawDataPreset, Sensor, Thing } from "state";
import { getRawDataPresets } from "crud";
import { CircularProgress } from "@mui/material";
import { NewRawBoxModal } from "./modals/newRawBoxModal";
import { RawDataPresetModal } from "./modals/rawDataPresetModal";
import RawBox from "./rawBox";
import "./_styling/rawDataView.css";

interface RawDataViewProps {
  sensors: Sensor[];
  things: Thing[];
  thing: Thing;
  onThingChange: (thing: Thing) => void;
}

const RawDataView: React.FC<RawDataViewProps> = (props: RawDataViewProps) => {
  const context = useContext(DashboardContext);
  const [fetchingPresets, setFetchingPresets] = useState<boolean>(false);
  const [rawDataPreset, setRawDataPreset] = useState<RawDataPreset>();
  const [rawDataPresets, setRawDataPresets] = useState<RawDataPreset[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertError, setAlertError] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showNewRawBoxModal, setShowNewRawBoxModal] = useState<boolean>(false);
  const [showRawDataPresetModal, setShowRawDataPresetModal] =
    useState<boolean>(false);
  const [boxes, setBoxes] = useState<any[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [noBoxes, setNoBoxes] = useState<boolean>(false);

  useEffect(() => {
    setFetchingPresets(true);
    getRawDataPresets(props.thing._id)
      .then((presets: RawDataPreset[]) => {
        presets.sort((a: RawDataPreset, b: RawDataPreset) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setRawDataPresets(presets);
        setFetchingPresets(false);
        if (presets.length === 0) alert(true, "No presets found...");
      })
      .catch((_: any) => {
        alert(true, "Could not fetch presets...");
        setFetchingPresets(false);
      });
  }, []);

  useEffect(() => {
    if (rawDataPreset) {
      let sensors: Sensor[] = [];
      for (const sensorId of rawDataPreset.sensorIds) {
        let sensor = props.sensors.filter((sensor) => sensor._id === sensorId);
        if (sensor.length === 1) sensors.push(sensor[0]);
      }
      setSensors(sensors);
    }
  }, [rawDataPreset]);

  useEffect(() => {
    if (rawDataPreset) {
      setRawDataPreset({
        ...rawDataPreset,
        sensorIds: sensors.map((sensor) => sensor._id),
      });
    }
    generateBoxes(sensors);
  }, [sensors]);

  const alert = (error: boolean, description: string) => {
    setAlertDescription(description);
    setAlertError(error);
    setShowAlert(true);
  };

  const generateBoxes = (sensors: Sensor[]) => {
    let boxes: any[] = [];
    for (const sensor of sensors) {
      boxes.push(
        <RawBox key={sensor._id} sensor={sensor} onDelete={onRawBoxDelete} />
      );
    }
    setBoxes(boxes);
  };

  const onNew = (newSensors: Sensor[]) => {
    if (newSensors && newSensors.length) {
      let updatedSensors = [...sensors];
      for (const sensor of newSensors) updatedSensors.push(sensor);
      updatedSensors.sort((a: Sensor, b: Sensor) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setSensors(updatedSensors);
      setNoBoxes(false);
      alert(
        false,
        newSensors.length > 1
          ? "New boxes were created..."
          : "New box was created..."
      );
    }
    setShowNewRawBoxModal(false);
  };

  const onRawBoxDelete = (sensorId: string) => {
    let updatedSensors = [];
    for (let sensor of [...sensors])
      if (sensor._id !== sensorId) updatedSensors.push(sensor);
    setSensors(updatedSensors);
    setNoBoxes(updatedSensors.length === 0);
    alert(false, "The box was deleted.");
  };

  const getUnselectedSensors = () => {
    let selectedSensorsIds = sensors.map((sensor) => sensor._id);
    let unselected = [];
    for (const sensor of props.sensors)
      if (!selectedSensorsIds.includes(sensor._id)) unselected.push(sensor);
    return unselected;
  };

  const onNewPreset = (preset: RawDataPreset) => {
    if (preset && preset._id) {
      let updatedPresets = [...rawDataPresets];
      let updated = false;
      for (let i in updatedPresets) {
        if (updatedPresets[i]._id === preset._id) {
          updatedPresets[i] = preset;
          updated = true;
        }
      }
      if (!updated) updatedPresets.push(preset);
      updatedPresets.sort((a: RawDataPreset, b: RawDataPreset) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setRawDataPresets(updatedPresets);
      setRawDataPreset(preset);
      if (updated) alert(false, "The Preset was updated.");
      else alert(false, "The Preset was created.");
    }
    setShowRawDataPresetModal(false);
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
              <ToolTip value="New Card">
                <IconButton
                  img={<Add />}
                  onClick={() => setShowNewRawBoxModal(true)}
                />
              </ToolTip>
              <ToolTip value="Save Preset">
                <IconButton
                  img={<SaveOutlined />}
                  onClick={() => setShowRawDataPresetModal(true)}
                />
              </ToolTip>
              {rawDataPresets.length !== 0 && (
                <DropDown
                  placeholder="Select Preset..."
                  options={rawDataPresets.map((preset) => {
                    return { value: preset, label: preset.name };
                  })}
                  onChange={(value: any) => setRawDataPreset(value.value)}
                  defaultValue={
                    rawDataPreset
                      ? { value: rawDataPreset, label: rawDataPreset.name }
                      : null
                  }
                  isSearchable
                />
              )}
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
                defaultValue={{
                  value: props.thing._id,
                  label: props.thing.name,
                }}
                isSearchable
              />
            </div>
          </DashNav>
          <div id="raw-data-boxes">{boxes}</div>
          {noBoxes && (
            <div id="dashboard-loading">
              <div id="dashboard-loading-content">
                <>
                  <b>No Sensors selected...</b>
                  <br />
                  <br />
                  <TextButton
                    title="Add Sensor(s)"
                    onClick={() => setShowNewRawBoxModal(true)}
                  />
                </>
              </div>
            </div>
          )}
        </>
      )}
      <NewRawBoxModal
        show={showNewRawBoxModal}
        toggle={onNew}
        sensors={getUnselectedSensors()}
      />
      <RawDataPresetModal
        show={showRawDataPresetModal}
        toggle={onNewPreset}
        rawDataPreset={rawDataPreset}
        selectedSensors={sensors}
        allSensors={props.sensors}
        thing={props.thing}
      />
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

export default RawDataView;
