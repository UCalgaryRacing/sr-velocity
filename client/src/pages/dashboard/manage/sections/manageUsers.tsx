// Copyright Schulich Racing, FSAE
// Written by Justin Tijunelis

import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "pages/dashboard/dashboard";
import { UserCard } from "../cards";
import { CircularProgress } from "@mui/material";
import { InputField, Alert } from "components/interface";
import {
  useAppSelector,
  RootState,
  User,
  isAuthAtLeast,
  UserRole,
} from "state";
import { getUsers } from "crud";
import DashNav from "components/navigation/dashNav";

export const ManageUsers: React.FC = () => {
  const context = useContext(DashboardContext);
  const user = useAppSelector((state: RootState) => state.user);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [userCards, setUserCards] = useState<any[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);
  const [noMatchingUsers, setNoMatchingUsers] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertDescription, setAlertDescription] = useState<string>("");

  useEffect(() => {
    getUsers()
      .then((users: User[]) => {
        users.sort((a: User, b: User) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        setUsers(users);
        setFetching(false);
      })
      .catch((_: any) => {
        setFetching(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    generateUserCards(users);
  }, [users]);

  const alert = (description: string) => {
    setAlertDescription(description);
    setShowAlert(true);
  };

  const generateUserCards = (users: User[]) => {
    let cards = [];
    for (const user of users) {
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
        <div id="">
          <DashNav margin={context.margin}>
            <div className="left"></div>
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
          <div id="manage-grid">{userCards}</div>
        </div>
      )}
      {noMatchingUsers && (
        <div id="no-match">
          <div id="no-match-content">
            <b>No matching Users found...</b>
          </div>
        </div>
      )}
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
