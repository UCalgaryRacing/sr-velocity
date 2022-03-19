// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { Thing } from "./";

export type Dashboard = {
  section: string;
  page: string;
  thing?: Thing;
};
