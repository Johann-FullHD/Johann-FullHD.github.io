import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./style.css";
import Foto from "./views/foto";
import TermsOfService from "./views/terms-of-service";
import FAQ from "./views/faq";
import PrivacyPolicy from "./views/privacy-policy";
import CodeOfConduct from "./views/code-of-conduct";
import About from "./views/about";
import Informatik from "./views/informatik";
import Contact from "./views/contact";
import Home from "./views/home";
import Error404 from "./views/error-404";
import Galerie from "./views/galerie";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Foto} exact path="/foto" />
        <Route component={TermsOfService} exact path="/terms-of-service" />
        <Route component={FAQ} exact path="/faq" />
        <Route component={PrivacyPolicy} exact path="/privacy-policy" />
        <Route component={CodeOfConduct} exact path="/code-of-conduct" />
        <Route component={About} exact path="/about" />
        <Route component={Informatik} exact path="/informatik" />
        <Route component={Contact} exact path="/contact" />
        <Route component={Home} exact path="/" />
        <Route component={Error404} path="**" />
        <Route component={Galerie} exact path="/galerie" />
        <Redirect to="**" />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
