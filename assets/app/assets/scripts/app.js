import React from "react"; // eslint-disable-line no-unused-vars
import { render } from "react-dom";
import { Router, Route, browserHistory } from "react-router";
import Main from "./components/Main";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

render(
    <Router history={browserHistory}>
        <Route path="/" component={Main} />
        <Route path="/:resource" component={Main} />
    </Router>,
    document.getElementById("root")
);
