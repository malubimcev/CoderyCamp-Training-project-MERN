import React from "react";
import ReactDOM from "react-dom";

import { Router, Route, Switch } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

import { createBrowserHistory } from "history";
const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return <Router history={ history }>
      <Switch>
        <Route exact path="/" component={ ProductsPage } />
        <Route exact path="/product/" component={ ProductsPage } />
        <Route exact path="/product/:product" component={ ProductPage } />
      </Switch>
    </Router>;
  }
}

ReactDOM.render(<App/>, document.querySelector("#root"));