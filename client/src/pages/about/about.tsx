// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useEffect, useState } from "react";
import { CardDeck } from 'react-bootstrap';
import "./about.css";
import leads from "./leads.json";
import { Member } from "./member";
import members from "./members.json";

const About: React.FC = () => {
   const [teamMembers, setTeamMembers] = useState<JSX.Element[]>([]);

   useEffect(() => {
      const memberElements = members.map(member => <Member member={member} />);
      setTeamMembers(memberElements);
   }, [setTeamMembers]);

   return (
      <div id="about">
         <div id="header">Meet the Makers</div>
         <div className="people">
            {leads.map(lead => <Member member={lead} />)}
         </div>
         <div className="people">
            <CardDeck style={{ justifyContent: "center" }}>
               {teamMembers}
            </CardDeck>
         </div>
         <div id="header">Meet the Design</div>
         <div id="sub-header">High-Level System Architecture</div>
         <div id="sub-header">Database Schema</div>
         <div id="sub-header">Variable Frequency Data Encoding</div>
         <div id="sub-header">Hardware State Machine</div>
         <div id="header">Enough Design, Just Look at the Code</div>
      </div >
   );
};

export default About;
