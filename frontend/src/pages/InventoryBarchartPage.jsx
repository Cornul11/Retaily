import React, { Component } from 'react';
import Barchart from '../components/charts/Barchart';
import BlueprintPage from './BlueprintPage';
import Absolute from '../components/Absolute';

class InventoryBarchartPage extends Component {
  render() {
    const absolute = this.context;
    return (
      <BlueprintPage
        content={
          <Barchart url={`${absolute ? 'https://retaily.site:7000' : ''}/inventory/`} />
        }
      />
    );
  }
}

InventoryBarchartPage.contextType = Absolute;
export default InventoryBarchartPage;
