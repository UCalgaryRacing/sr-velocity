// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord and Justin Tijunelis

import React, { useState, useContext, useEffect, useCallback } from "react";
import { Session, Collection, Thing, Operator } from "state";
import DashNav from "components/navigation/dashNav";
import {
  ToolTip,
  IconButton,
  TextButton,
  InputField,
  Alert,
} from "components/interface";
import { DashboardContext } from "../../dashboard";
import { Add } from "@mui/icons-material";
import { useWindowSize } from "hooks";
import { CollectionCard } from "./cards/collectionCard";
import { CollectionModal } from "./modals/collectionModal";

interface CollectionViewProps {
  viewChange: any;
  thingChange: any;
  thing: Thing;
  sessions: Session[];
  collections: Collection[];
  operators: Operator[];
  onUpdate: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = (
  props: CollectionViewProps
) => {
  const size = useWindowSize();
  const context = useContext(DashboardContext);
  const [query, setQuery] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>(
    props.collections
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => onSearch(query), [query]);
  useEffect(() => setCollections(props.collections), [props.collections]);

  const generateCollectionCards = useCallback(() => {
    let cards: any[] = [];
    for (const collection of collections) {
      cards.push(
        <CollectionCard
          key={collection._id}
          thing={props.thing}
          collection={collection}
          sessions={props.sessions}
          onUpdate={props.onUpdate}
          onDelete={props.onDelete}
        />
      );
    }
    return cards;
  }, [collections, props.sessions]);

  const onSearch = (query: string) => {
    let matchingCollections = [];
    let lowerQuery = query.toLowerCase().trim();
    for (let collection of [...props.collections]) {
      let nameMatches = collection.name.toLowerCase().includes(lowerQuery);
      let sessionsMatch =
        props.sessions.filter((s) => s.name.toLowerCase().includes(lowerQuery))
          .length > 0;
      if (nameMatches || sessionsMatch) matchingCollections.push(collection);
    }
    setCollections(matchingCollections);
  };

  return (
    <>
      <DashNav margin={context.margin}>
        <div className="left">
          {size.width >= 916 ? (
            <ToolTip value="New Session">
              <IconButton img={<Add />} onClick={() => setShowModal(true)} />
            </ToolTip>
          ) : (
            <TextButton
              title="New Session"
              onClick={() => setShowModal(true)}
            />
          )}
          {props.viewChange}
        </div>
        <div className="right">
          {props.thingChange}
          <InputField
            name="search"
            type="name"
            placeholder="Search..."
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            required
          />
        </div>
      </DashNav>
      <div id="grid">{generateCollectionCards()}</div>
      {props.collections.length === 0 ||
        (collections.length === 0 && (
          <div id="centered">
            <div id="centered-content">
              <b>
                {collections.length === 0
                  ? "No matching Collections."
                  : "No Collections yet."}
              </b>
              {props.sessions.length === 0 && (
                <TextButton
                  title="Create a Collection"
                  onClick={() => setShowModal(true)}
                />
              )}
            </div>
          </div>
        ))}
      {showModal && (
        <CollectionModal
          show={showModal}
          toggle={(collection: Collection) => {
            if (collection) props.onUpdate(collection);
            setShowModal(false);
          }}
          thing={props.thing}
          sessions={props.sessions}
        />
      )}
      <Alert
        title="Something went wrong..."
        description="Please try again..."
        color="red"
        onDismiss={() => setShowAlert(false)}
        show={showAlert}
        slideOut
      />
    </>
  );
};
