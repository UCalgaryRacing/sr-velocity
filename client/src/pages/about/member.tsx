import React from "react";
import { Figure, Card } from "react-bootstrap";
import { SocialIcon } from "react-social-icons";

interface MemberProps {
  sourceImage: string;
  name: string;
  description: string;
  linkedin?: string;
}

const Member: React.FC<MemberProps> = (props: MemberProps) => {
  return (
    <div id="member">
      <Card border="light">
        <Card.Body>
          <Figure.Image
            width={250}
            height={250}
            src={props.sourceImage}
            roundedCircle
          />
          <Card.Title>{props.name}</Card.Title>
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

export default Member;
