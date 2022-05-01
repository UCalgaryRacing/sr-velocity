// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import {
  TextButton,
  InputField,
  IconButton,
  ToolTip,
  Alert,
} from "components/interface";
import { CircularProgress } from "@mui/material";
import DashNav from "components/navigation/dashNav";
import { ThingModal } from "../modals/thingModal";
import { ThingCard } from "../cards";
import { getThings } from "crud";
import {
  useAppSelector,
  RootState,
  Thing,
  isAuthAtLeast,
  UserRole,
} from "state";
import { Add } from "@mui/icons-material";

export const ManageThings: React.FC = () => {
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [things, setThings] = useState<Thing[]>([]);
  const [thingCards, setThingCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [noThings, setNoThings] = useState<boolean>(false);
  const [noMatchingThings, setNoMatchingThings] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showThingModal, setShowThingModal] = useState<boolean>(false);

  useEffect(() => {
    getThings()
      .then((items: Thing[]) => {
        items.sort((a: Thing, b: Thing) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setThings(items);
        generateThingCards(items);
        setNoThings(items.length === 0);
        setFetching(false);
      })
      .catch((_: any) => {
        setFetching(false);
        setError(true);
      });
  }, []);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateThingCards = (items: Thing[]) => {
    let cards = [];
    for (const thing of items) {
      cards.push(
        <ThingCard
          thing={thing}
          key={thing._id}
          onThingUpdate={onNewThing}
          onThingDelete={onDeleteThing}
        />
      );
    }
    setThingCards(cards);
  };

  const onNewThing = (thing: Thing) => {
    if (thing && thing._id) {
      let updatedThings = [...things];
      let updated = false;
      for (let i in updatedThings) {
        if (updatedThings[i]._id === thing._id) {
          updatedThings[i] = thing;
          updated = true;
        }
      }
      if (!updated) updatedThings.push(thing);
      updatedThings.sort((a: Thing, b: Thing) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      setThings(updatedThings);
      generateThingCards(updatedThings);
      setNoThings(false);
      if (updated) alert("The thing was updated.");
      else alert("The thing was created.");
    }
    setShowThingModal(false);
  };

  const onDeleteThing = (thingId: string) => {
    let updatedThings = [];
    for (let thing of [...things]) {
      if (thing._id !== thingId) {
        updatedThings.push(thing);
      }
    }
    setThings(updatedThings);
    generateThingCards(updatedThings);
    setNoThings(updatedThings.length === 0);
    alert("The thing was deleted.");
  };

  const onSearch = (query: string) => {
    let matchingThings = [];
    for (let thing of [...things]) {
      if (thing.name.toLowerCase().includes(query.toLowerCase())) {
        matchingThings.push(thing);
      }
    }
    generateThingCards(matchingThings);
    setNoMatchingThings(matchingThings.length === 0);
  };

  return (
    <>
      {noThings || error || fetching ? (
        <div id="manage-loading">
          <div id="manage-loading-content">
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
                    ? "Your organization has no Things yet."
                    : "Could not fetch Things, please refresh."}
                </b>
                {!error && isAuthAtLeast(user, UserRole.ADMIN) && (
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
            <div className="left">
              {isAuthAtLeast(user, UserRole.ADMIN) && (
                <ToolTip value="Add">
                  <IconButton
                    onClick={() => setShowThingModal(true)}
                    img={<Add />}
                  />
                </ToolTip>
              )}
            </div>
            <div className="right">
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
          <div id="thing-cards">{thingCards}</div>
        </div>
      )}
      {noMatchingThings && (
        <div id="no-match">
          <div id="no-match-content">
            <b>No matching Things found...</b>
          </div>
        </div>
      )}
      <ThingModal show={showThingModal} toggle={onNewThing} />
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
