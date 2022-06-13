import React from "react";
import { SocialIcon } from "react-social-icons";
import "./social.css";

export default class Social extends React.Component {
  render = () => {
    return (
      <div id="social">
        <h1 id="followUs">Follow Us, Say Hello, or See the Code</h1>
        <div id="socialDescription" style={{ marginTop: "3%" }}>
          <h1
            style={{
              color: "#191919",
              fontSize: "2.5vw",
              marginBottom: "0%",
              fontWeight: "600",
            }}
          >
            For inquiries, contact business@schulichracing.ca.
          </h1>
        </div>
        <div id="socialMedia" style={{ width: "100%" }}>
          <SocialIcon
            id="facebook"
            url="https://www.facebook.com/schulichracing/"
            target="_blank"
            bgColor="#ba1833"
          />
          <SocialIcon
            id="instagram"
            url="https://www.instagram.com/schulich_fsae/?hl=en"
            target="_blank"
            bgColor="#ba1833"
          />
          <SocialIcon
            id="linkedin"
            url="https://www.linkedin.com/company/schulich-racing/mycompany/"
            target="_blank"
            bgColor="#ba1833"
          />
          <SocialIcon
            id="link"
            url="https://www.schulichracing.ca/"
            target="_blank"
            bgColor="#ba1833"
          />
          <SocialIcon
            id="github"
            url="https://github.com/SchulichRacingElectrical"
            target="_blank"
            bgColor="#ba1833"
          />
        </div>
        <h1
          style={{
            color: "#191919",
            fontSize: "2.5vw",
            marginBottom: "0%",
            fontWeight: "600",
          }}
        >
          Made with &hearts; and ♫ in Calgary, Alberta, Canada.
        </h1>
        <h1
          style={{
            color: "#191919",
            fontSize: "2vw",
            marginTop: "50px",
            marginBottom: "0",
            paddingBottom: "0",
          }}
        >
          Copyright © 2022 Schulich Racing, FSAE. All rights reserved.
        </h1>
      </div>
    );
  };
}
