// Copyright Schulich Racing FSAE
// Created by
// Justin Tijunelis, Jeremy Bilic, Justin Flores, Jon Mulyk,
// Camilla Abdrazakov, Abod Abbas, Jon Breidfjord, Arham Humayun,
// Ryan Ward, James Nguy, Hilmi Saleh

// @ts-nocheck

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
import About from "pages/about/about";
import Licenses from "pages/licenses/licenses";
import NotFound from "pages/404/notFound";
import AuthWrapper from "wrappers/authWrapper";
import Request from "pages/request/request"

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
          <Route exact path="/">
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          </Route>
          <Route exact path="/home">
            <AuthWrapper>
              <Home />
            </AuthWrapper>
          </Route>
          <Route exact path="/dashboard">
            <AuthWrapper>
              <Dashboard />
            </AuthWrapper>
          </Route>
          <Route exact path="/sign-in">
            <AuthWrapper>
              <SignIn />
            </AuthWrapper>
          </Route>
          <Route exact path="/sign-up">
            <AuthWrapper>
              <SignUp />
            </AuthWrapper>
          </Route>
          <Route exact path="/about">
            <AuthWrapper>
              <About />
            </AuthWrapper>
          </Route>
          <Route exact path="/licenses">
            <AuthWrapper>
              <Licenses />
            </AuthWrapper>
          </Route>
          <Route exact path="/request">
            <AuthWrapper>
              <Request />
            </AuthWrapper>
          </Route>
          <Route>
            <NotFound />
          </Route>
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
