// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import {
  TextButton,
  IconButton,
  ToolTip,
  Alert,
  InputField,
} from "components/interface";
import { CircularProgress } from "@mui/material";
import { OperatorCard } from "../cards";
import { OperatorModal } from "../modals/operatorModal";
import {
  useAppSelector,
  RootState,
  Operator,
  Thing,
  isAuthAtLeast,
  UserRole,
} from "state";
import DashNav from "components/navigation/dashNav";
import { getOperators, getThings } from "crud";
import { Add } from "@mui/icons-material";

export const ManageOperators: React.FC = () => {
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [things, setThings] = useState<Thing[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [operatorCards, setOperatorCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [noOperators, setNoOperators] = useState<boolean>(false);
  const [noMatchingOperators, setNoMatchingOperators] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showOperatorModal, setShowOperatorModal] = useState<boolean>(false);

  useEffect(() => {
    getOperators()
      .then((operators: Operator[]) => {
        getThings()
          .then((things: Thing[]) => {
            setThings(things);
            operators.sort((a: Operator, b: Operator) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setOperators(operators);
            generateOperatorCards(operators, things);
            setNoOperators(operators.length === 0);
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
  }, []);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateOperatorCards = (operators: Operator[], things: Thing[]) => {
    let cards = [];
    for (const operator of operators) {
      cards.push(
        <OperatorCard
          operator={operator}
          things={things}
          key={operator._id}
          onOperatorUpdate={onNewOperator}
          onOperatorDelete={onDeleteOperator}
        />
      );
    }
    setOperatorCards(cards);
  };

  const onNewOperator = (operator: Operator) => {
    if (operator && operator._id) {
      let updatedOperators = [...operators];
      let updated = false;
      for (let i in updatedOperators) {
        if (updatedOperators[i]._id === operator._id) {
          updatedOperators[i] = operator;
          updated = true;
        }
      }
      if (!updated) updatedOperators.push(operator);
      updatedOperators.sort((a: Operator, b: Operator) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setOperators(updatedOperators);
      generateOperatorCards(updatedOperators, things);
      setNoOperators(false);
      if (updated) alert("The operator was updated.");
      else alert("The operator was created.");
    }
    setShowOperatorModal(false);
  };

  const onDeleteOperator = (operatorId: string) => {
    let updatedOperators = [];
    for (let operator of [...operators]) {
      if (operator._id !== operatorId) {
        updatedOperators.push(operator);
      }
    }
    setOperators(updatedOperators);
    generateOperatorCards(updatedOperators, things);
    setNoOperators(updatedOperators.length === 0);
    alert("The operator was deleted.");
  };

  const onSearch = (query: string) => {
    let matchingOperators = [];
    for (let thing of [...operators]) {
      if (thing.name.toLowerCase().includes(query.toLowerCase())) {
        matchingOperators.push(thing);
      }
    }
    generateOperatorCards(matchingOperators, things);
    setNoMatchingOperators(matchingOperators.length === 0);
  };

  return (
    <>
      {noOperators || error || fetching ? (
        <div id="manage-loading">
          <div id="manage-loading-content">
            {fetching ? (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching Operators...</b>
              </>
            ) : (
              <>
                <b>
                  {!error
                    ? "Your organization has no Operators yet."
                    : "Could not fetch Operators, please refresh."}
                </b>
                {!error && isAuthAtLeast(user, UserRole.ADMIN) && (
                  <TextButton
                    title="Create a new Operator"
                    onClick={() => setShowOperatorModal(true)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="manage-operators">
          <DashNav margin={context.margin}>
            <div className="left">
              {isAuthAtLeast(user, UserRole.ADMIN) && (
                <ToolTip value="Add">
                  <IconButton
                    onClick={() => setShowOperatorModal(true)}
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
          <div id="manage-grid">{operatorCards}</div>
        </div>
      )}
      {noMatchingOperators && (
        <div id="no-match">
          <div id="no-match-content">
            <b>No matching Operators found...</b>
          </div>
        </div>
      )}
      <OperatorModal show={showOperatorModal} toggle={onNewOperator} />
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
