// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAppSelector, RootState } from "state";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useWindowSize } from "hooks/index";
import "./_styling/topNavigation.css";

const TopNavigation: React.FC = () => {
  const state = useAppSelector((state: RootState) => state);
  const size = useWindowSize();

  return (
    <>
      {window.location.pathname === "/dashboard" && (
        <div className="dash-title">
          <b>{state.dashboard.page}</b>
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
                {size.width >= 916 ? <InfoOutlinedIcon /> : <b>About</b>}
              </Nav.Link>
            )}
            {window.location.pathname !== "/sign-in" && !state.user && (
              <Nav.Link href="/sign-in">
                <b>Sign In</b>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default TopNavigation;
