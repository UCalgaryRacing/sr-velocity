// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import React, { useContext, useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";
import { DashboardContext } from "../dashboard";
import DashNav from "../dashnav";
import ManageCard from "./manageCard";
import ManageNav from "./manageNav";

interface ManageCardData {
  dateCreated: number;
  name: string;
}

const Manage: React.FC = () => {
  const section = useContext(DashboardContext);
  const [cards, setCards] = useState<{ [key: string]: ManageCardData[] }>({});

  const addCard = () => {
    const newCard: ManageCardData = {
      dateCreated: +new Date(),
      name: "New card",
    };
    let newCards = { ...cards };
    if (newCards[section]) {
      newCards[section].push(newCard);
    } else {
      newCards = {
        ...newCards,
        [section]: [newCard],
      };
    }
    setCards(newCards);
  };

  return (
    <>
      <DashNav>
        <ManageNav onAddCard={addCard} />
      </DashNav>
      <div>
        {cards[section]
          ?.sort((a, b) => b.dateCreated - a.dateCreated)
          .map((card) => (
            <ManageCard
              key={card.dateCreated}
              name={card.name}
              dateCreated={card.dateCreated}
            />
          ))}
      </div>
    </>
  );
};

export default Manage;
