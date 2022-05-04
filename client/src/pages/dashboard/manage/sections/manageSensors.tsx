// Copyright Schulich Racing, FSAE
// Written by Joey Van Lierop, Justin Tijunelis

import React, { useState, useEffect, useContext } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import DashNav from "components/navigation/dashNav";
import {
  isAuthAtLeast,
  RootState,
  Sensor,
  Thing,
  useAppSelector,
  UserRole,
} from "state";
import { SensorCard } from "../cards";
import { getThings, getSensors } from "crud";
import { CircularProgress } from "@mui/material";
import {
  TextButton,
  InputField,
  Alert,
  ToolTip,
  IconButton,
  DropDown,
} from "components/interface";
import { Add } from "@mui/icons-material";
import { SensorModal } from "../modals/sensorModal";
import { useWindowSize } from "hooks";

export const ManageSensors: React.FC = () => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [thing, setThing] = useState<Thing>();
  const [things, setThings] = useState<Thing[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [sensorCards, setSensorCards] = useState<any>([]);
  const [errorFetchingThings, setErrorFetchingThings] =
    useState<boolean>(false);
  const [errorFetchingSensors, setErrorFetchingSensors] =
    useState<boolean>(false);
  const [fetchingThings, setFetchingThings] = useState<boolean>(true);
  const [fetchingSensors, setFetchingSensors] = useState<boolean>(false);
  const [noThings, setNoThings] = useState<boolean>(false);
  const [noSensors, setNoSensors] = useState<boolean>(false);
  const [noMatchingSensors, setNoMatchingSensors] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showSensorModal, setShowSensorModal] = useState<boolean>(false);

  useEffect(() => {
    getThings()
      .then((things: Thing[]) => {
        things.sort((a: Thing, b: Thing) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setThings(things);
        setNoThings(things.length === 0);
        setFetchingThings(false);
      })
      .catch((_: any) => {
        setFetchingThings(false);
        setErrorFetchingThings(true);
      });
  }, []);

  useEffect(() => {
    if (thing) {
      setFetchingSensors(true);
      getSensors(thing?._id)
        .then((sensors: Sensor[]) => {
          sensors.sort((a: Sensor, b: Sensor) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
          setSensors(sensors);
          setNoSensors(sensors.length === 0);
          setFetchingSensors(false);
        })
        .catch((_: any) => {
          setFetchingSensors(false);
          setErrorFetchingSensors(true);
        });
    }
  }, [thing]);

  useEffect(() => {
    generateSensorCards(sensors);
  }, [sensors]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateSensorCards = (sensors: Sensor[]) => {
    let cards = [];
    for (const sensor of sensors) {
      cards.push(
        <SensorCard
          sensor={sensor}
          key={sensor._id}
          onSensorUpdate={onNewSensor}
          onSensorDelete={onDeleteSensor}
          thing={thing!}
        />
      );
    }
    setSensorCards(cards);
  };

  const onNewSensor = (sensor: Sensor) => {
    if (sensor && sensor._id) {
      let updatedSensors = [...sensors];
      let updated = false;
      for (let i in updatedSensors) {
        if (updatedSensors[i]._id === sensor._id) {
          updatedSensors[i] = sensor;
          updated = true;
        }
      }
      if (!updated) updatedSensors.push(sensor);
      updatedSensors.sort((a: Sensor, b: Sensor) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setSensors(updatedSensors);
      setNoSensors(false);
      if (updated) alert("The Sensor was updated.");
      else alert("The Sensor was created.");
    }
    setShowSensorModal(false);
  };

  const onDeleteSensor = (sensorId: string) => {
    let updatedSensors = [];
    for (let sensor of [...sensors]) {
      if (sensor._id !== sensorId) {
        updatedSensors.push(sensor);
      }
    }
    setSensors(updatedSensors);
    setNoSensors(updatedSensors.length === 0);
    alert("The Sensor was deleted.");
  };

  const onSearch = (query: string) => {
    let matchingSensors = [];
    for (let sensor of [...sensors]) {
      let lowerQuery = query.toLowerCase();
      let name = sensor.name.toLowerCase();
      let category = sensor.category ? sensor.category.toLowerCase() : "";
      if (name.includes(lowerQuery) || category.includes(lowerQuery)) {
        matchingSensors.push(sensor);
      }
    }
    generateSensorCards(matchingSensors);
    setNoMatchingSensors(matchingSensors.length === 0);
  };

  return (
    <>
      {noThings ||
      noSensors ||
      errorFetchingThings ||
      errorFetchingSensors ||
      fetchingThings ||
      fetchingSensors ? (
        <div id="manage-loading">
          <div id="manage-loading-content">
            {fetchingThings || fetchingSensors ? (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching&nbsp;{fetchingThings ? "Things" : "Sensors"}...</b>
              </>
            ) : (
              <>
                <b>
                  {!thing && (
                    <>
                      {!errorFetchingThings
                        ? "Your organization has no Things yet. You can create one on the Thing page."
                        : "Could not fetch Things, please refresh."}
                    </>
                  )}
                  {thing && (
                    <>
                      {!errorFetchingSensors && thing
                        ? "The Thing has no Sensors yet."
                        : "Could not fetch Sensors, please refresh."}
                    </>
                  )}
                </b>
                {!errorFetchingSensors &&
                  thing &&
                  isAuthAtLeast(user, UserRole.ADMIN) && (
                    <TextButton
                      title="Create a new Sensor"
                      onClick={() => setShowSensorModal(true)}
                    />
                  )}
                {!errorFetchingSensors && thing && (
                  <>
                    {isAuthAtLeast(user, UserRole.ADMIN) && (
                      <>
                        <br />
                        <br />
                        <b>Or select a different Thing:</b>
                      </>
                    )}
                    <br />
                    <br />
                    <DropDown
                      placeholder="Select Thing..."
                      options={things.map((thing) => {
                        return { value: thing._id, label: thing.name };
                      })}
                      onChange={(value: any) => {
                        for (const thing of things)
                          if (thing._id === value.value) setThing(thing);
                      }}
                      defaultValue={{ value: thing._id, label: thing.name }}
                      isSearchable
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="manage-content">
          {thing ? (
            <>
              <DashNav margin={context.margin}>
                {isAuthAtLeast(user, UserRole.ADMIN) && (
                  <div className="left">
                    {size.width >= 768.9 ? (
                      <ToolTip value="New Sensor">
                        <IconButton
                          onClick={() => setShowSensorModal(true)}
                          img={<Add />}
                        />
                      </ToolTip>
                    ) : (
                      <TextButton
                        title="New Sensor"
                        onClick={() => setShowSensorModal(true)}
                      />
                    )}
                  </div>
                )}
                <div className="right">
                  <DropDown
                    placeholder="Select Thing..."
                    options={things.map((thing) => {
                      return { value: thing._id, label: thing.name };
                    })}
                    onChange={(value: any) => {
                      for (const thing of things)
                        if (thing._id === value.value) setThing(thing);
                    }}
                    defaultValue={{ value: thing._id, label: thing.name }}
                    isSearchable
                  />
                  <InputField
                    name="search"
                    type="name"
                    placeholder="Search"
                    id="manage-nav-search"
                    value={query}
                    onChange={(e: any) => {
                      setQuery(e.target.value);
                      onSearch(e.target.value);
                    }}
                    required
                  />
                </div>
              </DashNav>
              <div id="manage-grid">{sensorCards}</div>
              {noMatchingSensors && (
                <div id="no-match">
                  <div id="no-match-content">
                    <b>No matching Sensors found...</b>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div id="manage-loading">
              <div id="manage-loading-content">
                <b>Select the Thing you want Sensors for:</b>
                <br />
                <br />
                <DropDown
                  placeholder="Select Thing..."
                  options={things.map((thing) => {
                    return { value: thing._id, label: thing.name };
                  })}
                  onChange={(value: any) => {
                    for (const thing of things)
                      if (thing._id === value.value) setThing(thing);
                  }}
                  isSearchable
                />
              </div>
            </div>
          )}
        </div>
      )}
      <SensorModal show={showSensorModal} toggle={onNewSensor} thing={thing!} />
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
