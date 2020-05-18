import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import InventoryBarchartPage from './pages/InventoryBarchartPage';
import ProductInfoPage from './pages/ProductInfoPage';
import KoppelVerkoopPage from './pages/KoppelVerkoopPage';
import HomePage from './pages/HomePage';
import SalesInfoPage from './pages/SalesInfoPage';
import Absolute from './components/Absolute';

const App = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Absolute.Provider value={true}>
    <BrowserRouter>
      <Route exact path="/" component={HomePage} />
      // not needed for now
      {/* <Route path="/inventorybarchart" component={InventoryBarchartPage} /> */}
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
  </Absolute.Provider>
);
ReactDOM.render(<App />, document.getElementById('root'));
