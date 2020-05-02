import React from "react";
import ReactDOM from "react-dom";
import InventoryBarchartPage from "./pages/InventoryBarchartPage";
import ProductInfoPage from "./pages/ProductInfoPage";
import KoppelVerkoopPage from "./pages/KoppelVerkoopPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Route exact path="/" component={HomePage} />
    <Route path="/inventorybarchart" component={InventoryBarchartPage} />
    <Route
      path="/extended/productinfo"
      render={(props) => <ProductInfoPage {...props} extended={true} />}
    />
    <Route
      path="/simple/productinfo"
      render={(props) => <ProductInfoPage {...props} extended={false} />}
    />
    <Route path="/koppelverkoop" component={KoppelVerkoopPage} />
  </BrowserRouter>
);
ReactDOM.render(<App />, document.getElementById("root"));
