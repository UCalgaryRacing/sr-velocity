// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import { TextButton } from "components/interface";
import { CircularProgress } from "@mui/material";
import DashNav from "components/navigation/dashNav";
import ManageNav from "../manageNav";
import { ThingModal } from "../modals/thingModal";
import { ThingCard } from "../cards";
import { getThings } from "crud";
import { Thing } from "state";
import "./_styling/manageThings.css";

export const ManageThings: React.FC = () => {
  const context = useContext(DashboardContext);
  const [things, setThings] = useState<Thing[]>([]);
  const [thingCards, setThingCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [noThings, setNoThings] = useState<boolean>(false);
  const [showThingModal, setShowThingModal] = useState<boolean>(false);

  useEffect(() => {
    getThings()
      .then((items: Thing[]) => {
        setThings(items);
        generateThingCards(items);
        if (items.length === 0) setNoThings(true);
        setFetching(false);
      })
      .catch((_: any) => {
        setFetching(false);
        setError(true);
      });
  }, []);

  const generateThingCards = (items: Thing[]) => {
    let cards = [];
    for (const thing of items) {
      cards.push(<ThingCard thing={thing} key={thing._id} />);
    }
    setThingCards(cards);
  };

  const onNewThing = (thing: Thing) => {
    if (thing._id) {
      let updatedThings = [...things];
      updatedThings.push(thing);
      // TODO: SORT accordingly (by name)
      setThings(updatedThings);
      setNoThings(false);
      generateThingCards(updatedThings);
    }
    setShowThingModal(false);
  };

  const onSearch = (query: string) => {
    // Search through things by name
  };

  return (
    <>
      {noThings || error || fetching ? (
        <div id="no-things">
          <div id="no-thing-content">
            {fetching ? (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching Things...</b>
              </>
            ) : (
              <>
                <b>
                  {!error
                    ? "You organization has no Things yet."
                    : "Could not fetch things, please refresh."}
                </b>
                {!error && (
                  <TextButton
                    title="Create a new Thing"
                    onClick={() => setShowThingModal(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="manage-things">
          <DashNav margin={context.margin}>
            <ManageNav onAddCard={() => setShowThingModal(true)} />
          </DashNav>
          <div id="thing-cards">{thingCards}</div>
        </div>
      )}
      <ThingModal show={showThingModal} toggle={onNewThing} />
    </>
  );
};
