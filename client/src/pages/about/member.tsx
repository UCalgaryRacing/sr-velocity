// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Card, Figure } from "react-bootstrap";
import { SocialIcon } from "react-social-icons";
import "./member.css";

export interface IMember {
  src: string;
  name: string;
  description?: string;
  linkedin?: string;
}

export const Member = ({ member }: { member: IMember }) => {
  return (
    <div
      className="member-card"
      style={{ paddingBottom: "20px", border: "0px solid !important" }}
    >
      <Card border="none">
        <Card.Body>
          <Figure.Image
            width={250}
            height={250}
            src={member.src}
            roundedCircle
          />
          <br />
          <br />
          <Card.Title>
            <b>{member.name}</b>
          </Card.Title>
          <Card.Text style={{ opacity: "0.5" }}>{member.description}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
