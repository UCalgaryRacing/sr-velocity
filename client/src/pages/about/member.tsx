// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React from "react";
import { Figure, Card, CardDeck } from "react-bootstrap";
import { SocialIcon } from "react-social-icons";
import "./member.css";

interface MemberProps {
  src?: string;
  name: string;
  description: string;
  linkedin?: string;
}

export const Member: React.FC<MemberProps> = (props: MemberProps) => {
  return (
    <div
      className="member-card"
      style={{ paddingBottom: "20px", border: "0px solid !important" }}
    >
      <Card border="light">
        <Card.Body>
          <Figure.Image
            width={250}
            height={250}
            src={props.src}
            roundedCircle
          />
          <Card.Title>
            <b>{props.name}</b>
          </Card.Title>
          <Card.Text style={{ opacity: "0.5" }}>{props.description}</Card.Text>

          <div id="socialMedia">
            {props.linkedin ? (
              <SocialIcon id="linkedin" url={props.linkedin} target="_blank" />
            ) : null}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
