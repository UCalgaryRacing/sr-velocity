// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Member } from "./member";
import { Figure, Card, CardDeck } from "react-bootstrap";
import leads from "./leads.json";
import "./about.css";

const About: React.FC = () => {
  return (
    <div id="about">
      <div id="header">Meet the Makers</div>
      <div className="people">
        {leads.map((member: any) => {
          return (
            <div className="person">
              <Member
                name={member.name}
                src={member.src}
                description={member.description}
                linkedin={member.linkedin}
              />
            </div>
          );
        })}
      </div>
      {/* <CardDeck style={{ justifyContent: "center" }}>
        {this.teamMembers}
      </CardDeck>
      <TopNav />
      <BottomNav /> */}
      <div id="header">Meet the Design</div>
      <div id="sub-header">High-Level System Architecture</div>
      <div id="sub-header">Database Schema</div>
      <div id="sub-header">Variable Frequency Data Encoding</div>
      <div id="sub-header">Hardware State Machine</div>
      <div id="header">Enough Design, Just Look at the Code</div>
    </div>
  );
};

export default About;
