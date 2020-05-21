import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import ProductInfoPage from './pages/ProductInfoPage';
import HomePage from './pages/HomePage';
import SalesInfoPage from './pages/SalesInfoPage';
import Absolute from './components/Absolute';

const App = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Absolute.Provider value={false}>
    <BrowserRouter>
      <Route exact path="/" component={HomePage} />
      {/* Not needed for now
      <Route path="/inventorybarchart" component={InventoryBarchartPage} /> */}
      <Route
        path="/extended/productinfo"
        render={(props) => <ProductInfoPage {...props} extended />}
      />
      <Route
        path="/simple/productinfo"
        render={(props) => <ProductInfoPage {...props} extended={false} />}
      />
      <Route path="/salesinfo" component={SalesInfoPage} />
    </BrowserRouter>
  </Absolute.Provider>
);
ReactDOM.render(<App />, document.getElementById('root'));
