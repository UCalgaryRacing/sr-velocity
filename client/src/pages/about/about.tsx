import React from "react";
import leads from "./leads.json";
import members from "./member.json";

const teamMembers = [
  {
    name: "Ryan",
    src: require("../assets/teamPictures/Ryan.jpg"),
    description: "Software",
    linkedin: "https://www.linkedin.com/in/ryan-ward-3177b61a1/",
  },
  {
    name: "James",
    src: require("../assets/teamPictures/James.jpg"),
    description: "Software",
    linkedin: "https://www.linkedin.com/in/james-nguy-4629a11b9/",
  },
  {
    name: "Camilla",
    src: require("../assets/teamPictures/Camilla.jpg"),
    description: "Software",
    linkedin: "https://www.linkedin.com/in/camilla-abdrazakov-4b077b1b2/",
  },
  {
    name: "Jon",
    src: require("../assets/teamPictures/nopic.png"),
    description: "Software",
    linkedin: "https://www.linkedin.com/in/jonathan-mulyk-2b91471b2/",
  },
  {
    name: "Justin",
    src: require("../assets/teamPictures/nopic.png"),
    description: "Software",
    linkedin: "www.linkedin.com/in/justinf34",
  },
  {
    name: "Arham",
    src: require("../assets/teamPictures/Arham.jpg"),
    description: "Software",
  },
  {
    name: "Aidan",
    src: require("../assets/teamPictures/Aidan.jpg"),
    description: "Electrical",
  },
  {
    name: "Yashvin",
    src: require("../assets/teamPictures/Yashvin.jpg"),
    description: "Electrical",
  },
  {
    name: "Will",
    src: require("../assets/teamPictures/Will.jpg"),
    description: "Electrical/Software Alumni",
  },
  {
    name: "Evan",
    src: require("../assets/teamPictures/Evan.jpg"),
    description: "Electrical Alumni",
  },
  {
    name: "Graison",
    src: require("../assets/teamPictures/nopic.png"),
    description: "Electrical Alumni",
  },
];

const About: React.FC = () => {
  return <div id="about"></div>;
};

export default About;
