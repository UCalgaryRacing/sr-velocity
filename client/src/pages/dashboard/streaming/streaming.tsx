// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../dashboard";
import ChartView from "./charts/chartView";
import RawDataView from "./raw_data/rawDataView";
import { DropDown } from "components/interface";
import { getThings, getSensors } from "crud";
import { CircularProgress } from "@mui/material";
import { Thing, Sensor } from "state";

enum StreamingSection {
  CHARTS = "Real-Time Charts",
  RAW_DATA = "Raw Data",
}

const Streaming: React.FC = () => {
  const context = useContext(DashboardContext);
  const [fetchingThings, setFetchingThings] = useState<boolean>(true);
  const [fetchingSensors, setFetchingSensors] = useState<boolean>(false);
  const [fetchingThingsError, setFetchingThingsError] =
    useState<boolean>(false);
  const [fetchingSensorsError, setFetchingSensorsError] =
    useState<boolean>(false);
  const [thing, setThing] = useState<Thing>();
  const [things, setThings] = useState<Thing[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    if (context.section !== "Streaming") {
      setThings([]);
      setSensors([]);
      setThing(undefined);
    }
  }, [context.section]);

  useEffect(() => {
    getThings()
      .then((things: Thing[]) => {
        things.sort((a: Thing, b: Thing) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setThings(things);
        if (things.length === 1) setThing(things[0]);
        setFetchingThings(false);
      })
      .catch((_: any) => {
        setFetchingThingsError(true);
        setFetchingThings(false);
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
          setFetchingSensors(false);
        })
        .catch((_: any) => {
          setFetchingSensorsError(true);
          setFetchingSensors(false);
        });
    }
  }, [thing]);

  if (context.section !== "Streaming") return <></>;

  if (!thing || fetchingSensors) {
    return (
      <div id="dashboard-loading">
        <div id="dashboard-loading-content">
          {(() => {
            if (fetchingThings || fetchingSensors) {
              return (
                <>
                  <CircularProgress style={{ color: "black" }} />
                  <br />
                  <br />
                  <b>
                    Fetching&nbsp;{fetchingThings ? "Things" : "Sensors"}...
                  </b>
                </>
              );
            } else if (fetchingThingsError || fetchingSensorsError) {
              return (
                <b>
                  Could not fetch&nbsp;{fetchingThings ? "Things" : "Sensors"}.
                  Please refresh to try again.
                </b>
              );
            } else {
              return (
                <>
                  {things?.length === 0 ? (
                    <>No Things are available.</>
                  ) : (
                    <>
                      <b>Select a Thing to view streaming data for:</b>
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
                    </>
                  )}
                </>
              );
            }
          })()}
        </div>
      </div>
    );
  } else if (sensors.length === 0) {
    return (
      <div id="dashboard-loading">
        <div id="dashboard-loading-content">
          <b>
            The Thing has no sensors. Select a different Thing or create sensors
            through the manage page.
          </b>
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
    );
  } else {
    switch (context.page) {
      case StreamingSection.CHARTS:
        return (
          <ChartView
            sensors={sensors}
            things={things}
            thing={thing}
            onThingChange={(thing: Thing) => setThing(thing)}
          />
        );
      case StreamingSection.RAW_DATA:
        return (
          <RawDataView
            sensors={sensors}
            things={things}
            thing={thing}
            onThingChange={(thing: Thing) => setThing(thing)}
          />
        );
      default:
        return <></>;
    }
  }
};

export default Streaming;
