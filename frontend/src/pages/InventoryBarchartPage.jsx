import React, { Component } from 'react';
import Barchart from '../components/charts/Barchart';
import BlueprintPage from './BlueprintPage';

class InventoryBarchartPage extends Component {
  render() {
    return (
      <BlueprintPage 
        content = {
          <Barchart url="/inventory/" />
        }
      />
    );
  }
}
export default InventoryBarchartPage;
