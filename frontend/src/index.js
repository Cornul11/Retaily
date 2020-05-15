import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import InventoryBarchartPage from './pages/InventoryBarchartPage';
import ProductInfoPage from './pages/ProductInfoPage';
import KoppelVerkoopPage from './pages/KoppelVerkoopPage';
import HomePage from './pages/HomePage';
import SalesInfoPage from './pages/SalesInfoPage';

const App = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <BrowserRouter>
    <Route exact path="/" component={HomePage} />
    <Route path="/inventorybarchart" component={InventoryBarchartPage} />
    <Route
      path="/extended/productinfo"
      render={(props) => <ProductInfoPage {...props} extended />}
    />
    <Route
      path="/simple/productinfo"
      render={(props) => <ProductInfoPage {...props} extended={false} />}
    />
    <Route path="/koppelverkoop" component={KoppelVerkoopPage} />
    <Route path="/salesinfo" component={SalesInfoPage} />
  </BrowserRouter>
);
ReactDOM.render(<App />, document.getElementById('root'));
