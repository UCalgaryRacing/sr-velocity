// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAppSelector, RootState } from "state";
import "./_styling/topNavigation.css";

const TopNavigation: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);
  const dashboard = useAppSelector((state: RootState) => state.dashboard);

  return (
    <>
      {window.location.pathname === "/dashboard" && (
        <div className="dash-title">
          <b>{dashboard.section}</b>
        </div>
      )}
      <Navbar
        id="top-navigation"
        collapseOnSelect
        expand="md"
        variant="dark"
        fixed="top"
      >
        <Navbar.Brand className="link-0" href="/">
          <img src={"assets/logo.png"} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {window.location.pathname !== "/dashboard" && (
            <Nav className="mr-auto">
              <Nav.Link href="/dashboard">
                <b>Dashboard</b>
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ml-auto">
            {window.location.pathname !== "/about" && (
              <Nav.Link href="/about">
                <b>About</b>
              </Nav.Link>
            )}
            {!signedIn && window.location.pathname !== "/signin" && (
              <Nav.Link href="/sign-in">
                <b>Sign In</b>
              </Nav.Link>
            )}
            {signedIn && (
              <Nav.Link href="/profile">
                <b>First Last</b>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default TopNavigation;
