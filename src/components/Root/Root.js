import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../../index.css";
import App from "../App/App";
import AlertUser from "../AlertUser/AlertUser";
import Chat from "../Chat/Chat";
import EnterUsername from "../EnterUsername/EnterUsername";
import ChannelTest from "../ChannelTest/ChannelTest";
import CreateChannel from "../CreateChannel/CreateChannel";
import MainComponent from "../MainComponent/MainComponent";

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Route path="/" component={App}></Route>
      <Route exact path="/alert-user" component={AlertUser}></Route>
      <Route path="/main" component={MainComponent}></Route>
      <Route exact path="/enter-username" component={EnterUsername}></Route>
      <Route exact path="/channel-test" component={ChannelTest}></Route>
      <Route exact path="/create-channel" component={CreateChannel}></Route>
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
