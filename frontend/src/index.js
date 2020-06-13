import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import ProductInfoPage from './pages/ProductInfoPage';
import HomePage from './pages/HomePage';
import SalesInfoPage from './pages/SalesInfoPage';
import Absolute from './components/Absolute';
import './App.css';

const App = () => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Absolute.Provider value={false}>
    <BrowserRouter>
      <Route exact path="/" component={HomePage} />
      <Route
        path="/uitgebreide/productinfo"
        render={(props) => <ProductInfoPage {...props} extended />}
      />
      <Route
        path="/standaard/productinfo"
        render={(props) => <ProductInfoPage {...props} extended={false} />}
      />
      <Route path="/transactie_informatie" component={SalesInfoPage} />
    </BrowserRouter>
  </Absolute.Provider>
);
ReactDOM.render(<App />, document.getElementById('root'));
