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
  DropDown,
} from "components/interface";
import { CircularProgress } from "@mui/material";
import DashNav from "components/navigation/dashNav";
import { ThingModal } from "../modals/thingModal";
import { ThingCard } from "../cards";
import { DashboardLoading } from "pages/dashboard/loading";
import { getThings, getOperators } from "crud";
import {
  useAppSelector,
  RootState,
  Thing,
  Operator,
  isAuthAtLeast,
  UserRole,
} from "state";
import { Add, CachedOutlined } from "@mui/icons-material";
import { useWindowSize } from "hooks";

export const ManageThings: React.FC = () => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [operatorFilter, setOperatorFilter] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [operators, setOperators] = useState<Operator[]>([]);
  const [things, setThings] = useState<Thing[]>([]);
  const [thingCards, setThingCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [noThings, setNoThings] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showThingModal, setShowThingModal] = useState<boolean>(false);

  useEffect(() => fetchThings(), []);
  useEffect(() => onSearch(query), [query]);
  useEffect(() => onSearch(query), [things, operators]);

  useEffect(() => {
    if (operatorFilter === "All") {
      generateThingCards(things, operators);
    } else {
      let filteredThings = [];
      for (const thing of things)
        if (thing.operatorIds.includes(operatorFilter))
          filteredThings.push(thing);
      generateThingCards(filteredThings, operators);
    }
  }, [operatorFilter]);

  const fetchThings = () => {
    setFetching(true);
    setError(false);
    getThings()
      .then((things: Thing[]) => {
        getOperators()
          .then((operators: Operator[]) => {
            operators.sort((a: Operator, b: Operator) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setOperators(operators);
            things.sort((a: Thing, b: Thing) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setThings(things);
            setNoThings(things.length === 0);
            setFetching(false);
          })
          .catch((_: any) => {
            setFetching(false);
            setError(true);
          });
      })
      .catch((_: any) => {
        setFetching(false);
        setError(true);
      });
  };

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateThingCards = (things: Thing[], operators: Operator[]) => {
    let cards = [];
    for (const thing of things) {
      cards.push(
        <ThingCard
          thing={thing}
          operators={operators}
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
      updatedThings.sort((a: Thing, b: Thing) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setThings(updatedThings);
      setNoThings(false);
      if (updated) alert("The Thing was updated.");
      else alert("The Thing was created.");
    }
    setShowThingModal(false);
  };

  const onDeleteThing = (thingId: string) => {
    let updatedThings = [];
    for (let thing of [...things])
      if (thing._id !== thingId) updatedThings.push(thing);
    setThings(updatedThings);
    setNoThings(updatedThings.length === 0);
    alert("The Thing was deleted.");
  };

  const onSearch = (query: string) => {
    let matchingThings = [];
    let lowerQuery = query.toLowerCase().trim();
    for (let thing of [...things])
      if (thing.name.toLowerCase().includes(lowerQuery))
        matchingThings.push(thing);
    generateThingCards(matchingThings, operators);
  };

  return (
    <>
      {noThings || error || fetching ? (
        <DashboardLoading>
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
                  : "Could not fetch Things."}
              </b>
              {!error && isAuthAtLeast(user, UserRole.ADMIN) && (
                <TextButton
                  title="Create a new Thing"
                  onClick={() => setShowThingModal(true)}
                />
              )}
              {error && (
                <TextButton title="Try Again" onClick={() => fetchThings()} />
              )}
            </>
          )}
        </DashboardLoading>
      ) : (
        <div id="manage-content">
          <DashNav margin={context.margin}>
            <div className="left">
              <>
                {size.width >= 916 ? (
                  <ToolTip value="Refresh">
                    <IconButton
                      img={<CachedOutlined />}
                      onClick={() => fetchThings()}
                    />
                  </ToolTip>
                ) : (
                  <TextButton title="Refresh" onClick={() => fetchThings()} />
                )}
                {size.width >= 916 ? (
                  <ToolTip value="New Thing">
                    <IconButton
                      onClick={() => setShowThingModal(true)}
                      img={<Add />}
                      disabled={!isAuthAtLeast(user, UserRole.ADMIN)}
                    />
                  </ToolTip>
                ) : (
                  <TextButton
                    title="New Thing"
                    onClick={() => setShowThingModal(true)}
                    disabled={!isAuthAtLeast(user, UserRole.ADMIN)}
                  />
                )}
              </>
            </div>
            <div className="right">
              <DropDown
                placeholder="Filter by Operator..."
                options={(() => {
                  let options = [
                    { value: "All", label: "All (Operator Filter)" },
                  ];
                  for (const operator of operators)
                    options.push({ value: operator._id, label: operator.name });
                  return options;
                })()}
                onChange={(value: any) => setOperatorFilter(value.value)}
                defaultValue={{ value: "All", label: "All (Operator Filter)" }}
                isSearchable
              />
              <InputField
                name="search"
                type="name"
                placeholder="Search..."
                value={query}
                onChange={(e: any) => setQuery(e.target.value)}
                required
              />
            </div>
          </DashNav>
          <div id="manage-grid">{thingCards}</div>
        </div>
      )}
      {thingCards.length === 0 && (
        <div id="centered">
          <div id="centered-content">
            <b>No matching Things found...</b>
          </div>
        </div>
      )}
      <ThingModal
        show={showThingModal}
        toggle={onNewThing}
        operators={operators}
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
