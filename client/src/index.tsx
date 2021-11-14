// Library Imports
import React from "react";
import ReactDOM from "react-dom";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { store } from "./state/store";
import { Provider } from "react-redux";

// Component Imports
import TopNavigation from "components/navigation/top-navigation/topNavigation";
import Dashboard from "pages/dashboard/dashboard";
import Licenses from "pages/licenses/licenses";

// Styling Imports
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <TopNavigation />
      <Router>
        <Switch>
          <Route exact path="/" />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/licenses" component={Licenses} />
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
