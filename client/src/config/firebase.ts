// Copyright Schulich Racing FSAE
// Written by Justin Tijunelis

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA_rSnvjJ0IsGQymwTFqo5pqKNtVYobeuQ",
  authDomain: "schulich-velocity.firebaseapp.com",
  databaseURL: "https://schulich-velocity.firebaseio.com",
  projectId: "schulich-velocity",
  storageBucket: "schulich-velocity.appspot.com",
  messagingSenderId: "627030248616",
  appId: "1:627030248616:web:bb53a4b31423b9523b069d",
  measurementId: "G-Z1BMTWXKCK",
};

initializeApp(firebaseConfig);
