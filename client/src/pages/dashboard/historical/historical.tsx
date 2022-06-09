// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord and Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../dashboard";
import { DashboardLoading } from "../loading";
import { TextButton, DropDown } from "components/interface";
import { Thing } from "state";
import { getThings } from "crud";
import { CircularProgress } from "@mui/material";
import DataView from "./data/dataView";
import PlotView from "./plots/plotView";

enum HistoricalSection {
  DATA = "Data",
  PLOTS = "Plots",
}

const Historical: React.FC = () => {
  const context = useContext(DashboardContext);
  const [things, setThings] = useState<Thing[]>([]);
  const [currentThing, setCurrentThing] = useState<Thing>();
  const [fetching, setFetching] = useState<{
    [k: string]: string | boolean;
  }>({ fetching: false, error: false });

  useEffect(() => fetchThings(), []);

  const fetchThings = () => {
    setFetching({ fetching: true, error: false });
    getThings()
      .then((things: Thing[]) => {
        things.sort((a: Thing, b: Thing) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setThings(things);
        if (things.length === 1) setCurrentThing(things[0]);
        setFetching({ fetching: false, error: false });
      })
      .catch((_: any) => {
        setFetching({ fetching: false, error: true });
      });
  };

  if (!currentThing || fetching["fetching"]) {
    return (
      <DashboardLoading>
        {(() => {
          if (fetching["fetching"]) {
            return (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching Things...</b>
              </>
            );
          } else if (fetching["error"]) {
            return (
              <>
                <b>Could not fetch Things.</b>
                <TextButton title="Try Again" onClick={() => fetchThings()} />
              </>
            );
          } else {
            return (
              <>
                {things?.length === 0 ? (
                  <>
                    No Things are available. Create one through the manage page.
                  </>
                ) : (
                  <>
                    <b>Select a Thing to view historical data for:</b>
                    <br />
                    <br />
                    <DropDown
                      placeholder="Select Thing..."
                      options={things.map((thing) => {
                        return {
                          value: thing,
                          label: thing.name,
                        };
                      })}
                      onChange={(value: any) => setCurrentThing(value.value)}
                      isSearchable
                    />
                  </>
                )}
              </>
            );
          }
        })()}
      </DashboardLoading>
    );
  } else {
    switch (context.page) {
      case HistoricalSection.DATA:
        return (
          <DataView
            things={things}
            thing={currentThing}
            onThingChange={setCurrentThing}
          />
        );
      case HistoricalSection.PLOTS:
        return (
          <PlotView
            things={things}
            thing={currentThing}
            onThingChange={setCurrentThing}
          />
        );
      default:
        return <></>;
    }
  }
};

export default Historical;
