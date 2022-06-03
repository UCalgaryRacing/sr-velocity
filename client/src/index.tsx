// Copyright Schulich Racing FSAE
// Created by
// Justin Tijunelis, Jeremy Bilic, Justin Flores, Jon Mulyk,
// Camilla Abdrazakov, Abod Abbas, Jon Breidfjord, Arham Humayun,
// Ryan Ward, James Nguy, Hilmi Saleh

// Library Imports
import React from "react";
import ReactDOM from "react-dom";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { store } from "./state";
import { Provider } from "react-redux";

// Component Imports
import TopNavigation from "components/navigation/topNavigation";
import Home from "pages/home/home";
import Dashboard from "pages/dashboard/dashboard";
import SignIn from "pages/auth/signIn";
import SignUp from "pages/auth/signUp";
import Licenses from "pages/licenses/licenses";
import NotFound from "pages/404/notFound";
import AuthWrapper from "wrappers/authWrapper";

// Styling Imports
import "bootstrap/dist/css/bootstrap.min.css";
import "./override.css";
import "./index.css";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <TopNavigation />
      <Router>
        <Switch>
          <AuthWrapper>
            <Route path="/">
              <Home />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/sign-up">
              <SignUp />
            </Route>
            <Route path="/licenses">
              <Licenses />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </AuthWrapper>
        </Switch>
      </Router>
    </React.Fragment>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
