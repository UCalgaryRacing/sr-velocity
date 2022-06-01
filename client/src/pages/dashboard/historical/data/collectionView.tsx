// Copyright Schulich Racing FSAE
// Written by Jonathan Breidfjord and Justin Tijunelis

import React from "react";
import { Session, Collection } from "state";

interface CollectionViewProps {
  viewChange: any;
  thingChange: any;
  sessions: Session[];
  collections: Collection[];
  onUpdate: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

export const CollectionView: React.FC<CollectionViewProps> = (
  props: CollectionViewProps
) => {
  return <div id="run-list" className="data-list"></div>;
};
