import React, { Component } from 'react';
import Barchart from '../components/charts/Barchart';
import BlueprintPage from './BlueprintPage';

class InventoryBarchartPage extends Component {
  render() {
    return (
      <BlueprintPage
        content={
          <Barchart url="https://retaily.site:7000/inventory/" />
        }
      />
    );
  }
}
export default InventoryBarchartPage;
