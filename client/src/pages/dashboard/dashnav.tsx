// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import "./_styling/dashnav.css";

const DashNav: React.FC = (props) => {
  return <div id="dash-nav">{props.children}</div>;
};

export default DashNav;
