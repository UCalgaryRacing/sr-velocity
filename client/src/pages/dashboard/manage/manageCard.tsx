// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop

import React from "react";
import "./_styling/manageCard.css";

interface ManageCardProps {
  dateCreated: number;
  name: string;
}

const ManageCard: React.FC<ManageCardProps> = (props) => {
  return (
    <div className="manage-card">
      <p>{props.name}</p>
      <p>{new Date(props.dateCreated).toLocaleDateString()}</p>
    </div>
  );
};

export default ManageCard;
