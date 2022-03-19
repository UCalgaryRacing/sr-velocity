// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop

import { DropDown, IconButton, InputField } from "components/interface";
import React, { useState } from "react";
import "./_styling/manageNav.css";
import { RiAddBoxLine } from "react-icons/ri";

interface ManageNavProps {
  onAddCard: () => void;
}

const ManageNav: React.FC<ManageNavProps> = (props) => {
  const [search, setSearch] = useState("");

  return (
    <div id="manage-nav">
      <RiAddBoxLine className="manage-button" onClick={props.onAddCard} />
      <div id="manage-nav-right">
        <DropDown
          options={[
            { value: "alphabetical", label: "Alphabetical" },
            { value: "date", label: "Date created" },
          ]}
          placeholder="Sort"
          id="manage-nav-sort"
        >
          Sort
        </DropDown>
        <InputField
          name="search"
          type="name"
          placeholder="Search"
          id="manage-nav-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ManageNav;
