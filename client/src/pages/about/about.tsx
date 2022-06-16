// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Member } from "./member";
import { Figure, Card, CardDeck } from "react-bootstrap";
import leads from "./leads.json";
import "./about.css";

const About: React.FC = () => {
  return (
    <div id="aboutPage" style={{ marginTop: "80px" }}>
      <p
        style={{
          textAlign: "center",
          fontSize: "xx-large",
          borderBottomStyle: "solid",
          borderBottomColor: "#C22E2D",
          paddingBottom: "20px",
          marginBottom: "50px",
        }}
      >
        Meet the Makers
      </p>
      <CardDeck style={{ justifyContent: "center" }}>
        {leads.map((member: any) => {
          return (
            <div style={{ textAlign: "center" }}>
              <Member
                name={member.name}
                src={member.src}
                description={member.description}
                linkedin={member.linkedin}
              />
            </div>
          );
        })}
      </CardDeck>
      {/* <CardDeck style={{ justifyContent: "center" }}>
        {this.teamMembers}
      </CardDeck>
      <TopNav />
      <BottomNav /> */}
    </div>
  );
};

export default About;
