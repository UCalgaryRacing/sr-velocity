// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import { UserCard } from "../cards";
import { CircularProgress } from "@mui/material";
import { TextButton } from "components/interface";
import {
  useAppSelector,
  RootState,
  User,
  isAuthAtLeast,
  UserRole,
} from "state";

export const ManageUsers: React.FC = () => {
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [noMatchingUsers, setNoMatchingUsers] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  useEffect(() => {
    // TODO: Fetch the users
  }, []);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateUserCards = (items: User[]) => {
    let cards = [];
    for (const user of items) {
      cards.push(<UserCard key={user._id} />); // TODO: Add props
    }
    setUserCards(cards);
  };

  const onDeleteUser = (userId: string) => {
    // TODO
  };

  const onPromoteUser = (userId: string) => {
    // TODO
  };

  const onSearch = (query: string) => {
    let matchingUsers = [];
    for (let user of [...users]) {
      if (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      ) {
        matchingUsers.push(user);
      }
    }
    generateUserCards(matchingUsers);
    setNoMatchingUsers(matchingUsers.length === 0);
  };

  return (
    <>
      {error || fetching ? (
        <div id="manage-loading">
          <div id="manage-loading-content">
            {fetching ? (
              <>
                <CircularProgress style={{ color: "black" }} />
                <br />
                <br />
                <b>Fetching Users...</b>
              </>
            ) : (
              <>
                <b>{error && "Could not fetch users, please refresh."}</b>
              </>
            )}
          </div>
        </div>
      ) : (
        <div id="manage-users"></div>
      )}
    </>
  );
};
