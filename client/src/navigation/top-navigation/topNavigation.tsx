// Library Imports
import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";

// Styling Imports
import "./topNavigation.css";

const TopNavigation: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <Navbar
      id="top-navigation"
      collapseOnSelect
      expand="md"
      variant="dark"
      fixed="top"
    >
      <Navbar.Brand className="link-0" href="/">
        <b>SR Velocity</b>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {signedIn && (
          <Nav className="mr-auto">
            <Nav.Link href="/streaming">
              <b>Streaming</b>
            </Nav.Link>
            <Nav.Link href="/historical">
              <b>Historical</b>
            </Nav.Link>
            <Nav.Link href="/manage">
              <b>Manage</b>
            </Nav.Link>
          </Nav>
        )}
        <Nav className="ml-auto">
          <Nav.Link href="/about">
            <b>About</b>
          </Nav.Link>
          {!signedIn && (
            <Nav.Link href="/signin">
              <b>Login</b>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavigation;
