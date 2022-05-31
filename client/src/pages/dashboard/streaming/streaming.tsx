// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState, useRef } from "react";
import { DashboardContext } from "../dashboard";
import ChartView from "./plots/chartView";
import RawDataView from "./raw_data/rawDataView";
import { DropDown, Alert, TextButton } from "components/interface";
import { getThings, getSensors } from "crud";
import { CircularProgress } from "@mui/material";
import { Thing, Sensor } from "state";
import { Stream } from "stream/stream";
import { DashboardLoading } from "../loading";

enum StreamingSection {
  CHARTS = "Real-Time Charts",
  RAW_DATA = "Raw Data",
}

const Streaming: React.FC = () => {
  const context = useContext(DashboardContext);

  // Stream callbacks
  const [disconnectSubId, setDisconnectSubId] = useState<string>("");
  const onDisconnectionCallback = useRef<() => void>(null);

  // Streaming State
  const [stream] = useState<Stream>(new Stream());
  const [fetchingThings, setFetchingThings] = useState<boolean>(true);
  const [fetchingSensors, setFetchingSensors] = useState<boolean>(false);
  const [fetchingThingsError, setFetchingThingsError] =
    useState<boolean>(false);
  const [fetchingSensorsError, setFetchingSensorsError] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [thing, setThing] = useState<Thing>();
  const [things, setThings] = useState<Thing[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    fetchThings();
    return () => stream.unsubscribeFromDisconnection(disconnectSubId);
  }, []);

  useEffect(() => {
    fetchSensors(); // @ts-ignore
    onDisconnectionCallback.current = onDisconnection;
  }, [thing, stream]);

  const fetchThings = () => {
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
  };

  const fetchSensors = () => {
    if (thing) {
      // Fetch the sensors
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
          setThing(undefined);
          setFetchingSensorsError(true);
          setFetchingSensors(false);
        });

      // Reopen the stream with the new thing id
      stream.unsubscribeFromDisconnection(disconnectSubId);
      stream.close();
      stream.connect(thing._id);
      setDisconnectSubId(
        stream.subscribeToDisconnection(onDisconnectionCallback)
      );
    }
  };

  const onDisconnection = () => {
    setThing(undefined);
    setShowAlert(true);
  };

  if (context.section !== "Streaming") return <></>;

  if (!thing || fetchingSensors) {
    return (
      <>
        <DashboardLoading>
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
                <>
                  <b>
                    Could not fetch&nbsp;{fetchingThings ? "Things" : "Sensors"}
                    .
                  </b>
                  <TextButton
                    title="Try Again"
                    onClick={() => {
                      if (fetchingThings) fetchThings();
                      else fetchSensors();
                    }}
                  />
                </>
              );
            } else {
              return (
                <>
                  {things?.length === 0 ? (
                    <>
                      No Things are available. Create one through the manage
                      page.
                    </>
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
        </DashboardLoading>
        <Alert
          title="Something went wrong..."
          description="The real-time stream disconnected."
          color="red"
          onDismiss={() => setShowAlert(false)}
          show={showAlert}
          slideOut
        />
      </>
    );
  } else if (sensors.length === 0) {
    return (
      <DashboardLoading>
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
      </DashboardLoading>
    );
  } else {
    switch (context.page) {
      case StreamingSection.CHARTS:
        return (
          <ChartView
            sensors={sensors}
            things={things}
            thing={thing}
            stream={stream}
            onThingChange={(thing: Thing) => setThing(thing)}
          />
        );
      case StreamingSection.RAW_DATA:
        return (
          <RawDataView
            sensors={sensors}
            things={things}
            thing={thing}
            stream={stream}
            onThingChange={(thing: Thing) => setThing(thing)}
          />
        );
      default:
        return <></>;
    }
  }
};

export default Streaming;
