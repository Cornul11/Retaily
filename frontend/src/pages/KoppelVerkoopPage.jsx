import React, { Component } from 'react';
import KoppelVerkoop from '../components/input/KoppelVerkoop';
import BlueprintPage from './BlueprintPage';

class KoppelVerkoopPage extends Component {
  render() {
    return (
      <BlueprintPage
        content={
          <KoppelVerkoop url="/koppelverkoop/" />
        }
      />
    );
  }
}
export default KoppelVerkoopPage;
