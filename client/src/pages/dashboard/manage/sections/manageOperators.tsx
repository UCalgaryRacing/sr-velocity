// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import {
  useAppSelector,
  RootState,
  Operator,
  isAuthAtLeast,
  UserRole,
} from "state";

export const ManageOperators: React.FC = () => {
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [operators, setOperators] = useState<Operator[]>([]);
  const [operatorCards, setOperatorCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [noOperators, setNoOperators] = useState<boolean>(false);
  const [noMatchingOperators, setNoMatchingOperators] =
    useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");
  const [showOperatorModal, setShowOperatorModal] = useState<boolean>(false);

  useEffect(() => {
    // TODO: Fetch operators
  }, []);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateOperatorCards = (items: Operator[]) => {
    // TODO
  };

  const onNewOperator = (operator: Operator) => {
    // TODO
  };

  const onDeleteOperator = (operatorId: string) => {
    // TODO
  };

  const onSearch = (query: string) => {
    let matchingOperators = [];
    for (let thing of [...operators]) {
      if (thing.name.toLowerCase().includes(query.toLowerCase())) {
        matchingOperators.push(thing);
      }
    }
    generateOperatorCards(matchingOperators);
    setNoMatchingOperators(matchingOperators.length === 0);
  };

  return <></>;
};
