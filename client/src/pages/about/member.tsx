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
      <Card border="light">
        <Card.Body>
          <Figure.Image
            width={250}
            height={250}
            src={member.src}
            roundedCircle
          />
          <Card.Title>
            <b>{member.name}</b>
          </Card.Title>
          <Card.Text style={{ opacity: "0.5" }}>{member.description}</Card.Text>

          <div id="socialMedia">
            {member.linkedin ? (
              <SocialIcon id="linkedin" url={member.linkedin} target="_blank" />
            ) : null}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
