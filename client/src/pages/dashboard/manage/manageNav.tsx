// Copyright Schulich Racing FSAE
// Written by Joey Van Lierop

import {
  DropDown,
  IconButton,
  InputField,
  ToolTip,
} from "components/interface";
import React, { useState } from "react";
import { Add } from "@mui/icons-material";

interface ManageNavProps {
  onAddCard: () => void;
}

const ManageNav: React.FC<ManageNavProps> = (props) => {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="left">
        <ToolTip value="Add">
          <IconButton onClick={props.onAddCard} img={<Add />} />
        </ToolTip>
      </div>
      <div className="right">
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
    </>
  );
};

export default ManageNav;
