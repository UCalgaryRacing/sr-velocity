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
    </div>
  );
};

export default About;
