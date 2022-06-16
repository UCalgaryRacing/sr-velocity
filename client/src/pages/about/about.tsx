// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useState, useEffect } from "react";
import { CardDeck } from "react-bootstrap";
import { SocialIcon } from "react-social-icons";
import { Member } from "./member";
import leads from "./leads.json";
import members from "./members.json";
import alumni from "./alumni.json";
import "./about.css";

const About: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const memberElements = leads.map((member) => <Member member={member} />);
    setTeamMembers(memberElements);
  }, [setTeamMembers]);

  return (
    <div id="about">
      <div id="design">
        <div id="header">Meet the Design</div>
        <div id="sub-header">High-Level System Architecture</div>
        <img src="assets/design/architecture.png" />
        <div id="design-section">
          <div className="design-header">Overview</div>
          <div className="design-description">
            We used a wide variety of technologies in unison. Based on the core
            competencies, interests, and design discretion of the team, the
            above architecture was created. A micro-service architecture was
            utilized for ease of concurrent development, deployment, and future
            scalability. Most of our design goals centered around developing a
            generic and real-time telemetry system, which was reflected with
            cache databases and efficient storage and transmission of data. We
            discovered that we could host telemetry for every FSAE vehicle at
            Michigan, 2022 (both months).
          </div>
          <div className="design-header">Validation</div>
          <div className="design-description">
            In addition to the labelled technologies; GitHub, Jira, Docker,
            Postman, AWS, C, and Legato were used in creating SR Velocity. In
            test design, we did not feel that unit testing and high code
            coverage were appropriate for the scope of the project, or its
            timelines. Instead, we focused mainly on end-to-end testing via
            simulation, and Postman has tested and documented all of our API
            endpoints. Through the simulator, we tested new streaming/storage
            related features to acceptance. Other testing, mainly UI, involved
            ad-hoc and beta testing through our team.
          </div>
          <div className="design-header">Deployment</div>
          <div className="design-description">
            Thanks to Cybera in Calgary, Alberta, Canada, we have a free server
            with 4 cores, 8 GB RAM, and 256 GB SSD. A GitHub Actions runner
            deploys published production releases of each micro-service. That
            is, we can update our website at the click of a button. Each service
            and database is dockerized and running under a shared network. SR
            Velocity's performance and scalability is a function of frequency
            and data throughput. Through a load test and current configuration,
            the system can support ~600 simulateneously streaming FSAE vehicles
            before consuming memory, and ~400 before bottlenecking CPU. Max
            throughput is a function of available cache memory, mean frequency
            of all streams, mean size per streaming message, and cpu core count.
          </div>
          <div className="design-header">Economics</div>
          <div className="design-description">
            On a paid cloud platform, we estimate the "raw material" telemetry
            cost for the SR-21 to be ~$0.20/hr (USD), growing slightly as more
            data is stored. However, at full utilization, ~$0.0005 (depending on
            hardware, assuming Cybera server from above). Data transmission
            costs (LTE) are also reduced by ~90% from the encoding discussed
            later ($3.90/hr to $0.26/hr). The cost of hosting one FSAE vehicle
            (including data costs) at low scale is ~$0.46/hr, with economies of
            scale, cost approaches data transmission cost ($0.26/hr).
          </div>
        </div>
        <div id="sub-header">Database Schema</div>
        <img src="assets/design/schema.png" />
        <div id="design-section">
          <div className="design-header">Overview</div>
          <div className="design-description">
            As you can see, we have a highly relational database, and thus use
            SQL. Based on our requirements for genericism, we use a multi-tenant
            database to host organizations (e.g., Schulich Racing, FSAE, etc.).
            Our Go API service provides security via JWT and API Key. We prevent
            "cross-tenant" CRUD operations through propogation. Postman
            documentation is coming soon.
          </div>
          <div className="design-header">Operator-Sensor-Thing</div>
          <div className="design-description">
            The core of the database; a convenient grouping to represent any IoT
            device. A Thing is "anything" you want to collect data for, which
            has many Sensors, and could related to many Operators (e.g.,
            drivers). Sessions are defined as a "start to stop stream of data",
            and collections allow grouping of Sessions. For centralization of
            qualitative data, we enable comments on most tables. Finally, Charts
            and Presets are convenient stores for UI. The database is easy to
            build upon and update using auto migration tools and code-defined
            schemas (GORM).
          </div>
        </div>
        <div id="sub-header">Variable Frequency Data Encoding</div>
        <img src="assets/design/encoding.png" />
        <div id="design-section">
          <div className="design-header">Packing Bytes</div>
          <div className="design-description">
            We broke down the problem of sending LTE data to the bits and bytes
            that matter most. By using a "frequency decimation" technique, we
            are able to send data only when it is updated, and more importantly,
            when statistically significant. Compared to sending on a timer, the
            SR-21 sends 80% more bytes per minute. Since most data don't change
            often, the true data savings are 90%. The rest of the software fills
            in the gaps, but also benefits from less data being queued. When
            users enter sensors into the UI, the sensor's type is automatically
            fit into the smallest C-type based on range. On this frontend, the
            charts are rendered via GPU so we decimate streaming frequency to 24
            Hz. However, data is always stored at its natural frequency, in CSV
            and time series format.
          </div>
        </div>
        <div id="sub-header">Hardware Flow Diagram</div>
        <img
          src="assets/design/hwflow.png"
          style={{ height: "800vh !important" }}
        />
        <div id="design-section">
          <div className="design-header">The Edge</div>
          <div className="design-description">
            All systems except hardware are generic in SR Velocity. The API
            simply provides an interface for a "Thing" to send its data.
            Fortunately, the above diagram is a blueprint for another FSAE team,
            hobby developer, or company to collect data from their "Thing". The
            best part of the design is two-way communication. Any device with a
            connection to Wi-Fi or mobile networks can utilize SR Velocity.
          </div>
        </div>
      </div>
      <div id="header">Meet the Design Process</div>
      <div id="design-section">
        <div className="design-header">Getting on the Same Page</div>
        <div className="design-description">
          To more easily communicate, the team migrated all
          messaging/calling/files to the Microsoft platform via Teams/other. We
          felt it was important to centralize our data, and implement
          organizational infrastructure. With respect to workflow management,
          each subteams implements their own standard and processes. However,
          the team always seeks to improve and implement changes that save time
          and deliver higher quality work. Our team believes is enabling others
          and encourages members to take leadership and ownership of their work.
        </div>
        <div className="design-header">A Case Study</div>
        <div className="design-description">
          Schulich Racing's software sub-team is likely the largest in North
          America, possibly the world. Over 3 years since its founding, 13
          people members have joined, with 8 currently active. A book called
          "Turn the Ship Around!" by L. David Marquet, inspired its creation. In
          the book, we seek to turn followers into leaders through their best
          utilization and position to succeed. By taking a hint from the
          software industry, we danced around with Agile development.
        </div>
        <br />
        <div className="design-description">
          In the dancing, we played with Jira. While it was nice to visualize a
          timeline and have a "bunch of things to do", we found that this could
          get populated with busy work. We also felt that formalizing a process
          through Jira for a student club felt a bit corporate. Instead, we used
          a tool we love, GitHub and natural language. We found that having a
          meeting to draw out requirements between developers was the best
          method of making a "bunch of things to do", while cutting out items
          that were not adding value. We utilized GitHub Actions, code reviews,
          and projects to manage code bases and requirements. We also used a
          feature branching strategy in developing the code base. In general, we
          designed, built, measured, learned, and repeated. Our team's leaders
          have actively improved design and organization processes, but in
          accordance to what's best for their team.
        </div>
      </div>
      <div id="header">Meet the Makers</div>
      <div id="sub-header">Leads</div>
      <div className="people">
        {leads.map((lead) => (
          <Member member={lead} />
        ))}
      </div>
      <div id="sub-header">Members</div>
      <div className="people">
        {members.map((member) => (
          <Member member={member} />
        ))}
      </div>
      <div id="sub-header">Alumni</div>
      <div className="people">
        {alumni.map((member) => (
          <Member member={member} />
        ))}
      </div>
      <div id="header">Meet the Code</div>
      <div id="social">
        <div id="socialMedia" style={{ width: "100%" }}>
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
    </div>
  );
};

export default About;
