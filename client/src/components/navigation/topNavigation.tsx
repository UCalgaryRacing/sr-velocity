// Library Imports
import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { useAppSelector } from "state";

// Styling Imports
import "./_styling/topNavigation.css";

const selectUser = (state: any) => state.user

const TopNavigation: React.FC = () => {
  const user = useAppSelector(selectUser);

  return (
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
          {user == null && window.location.pathname !== "/signin" && (
            <Nav.Link href="/sign-in">
              <b>Sign In</b>
            </Nav.Link>
          )}
          {user != null && (
            <Nav.Link href="/profile">
              <b>{user.name}</b>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavigation;
