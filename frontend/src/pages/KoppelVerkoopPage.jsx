import React from 'react';
import KoppelVerkoop from '../components/input/KoppelVerkoop';
import BlueprintPage from './BlueprintPage';

const KoppelVerkoopPage = () => (
  <BlueprintPage
    content={
      <KoppelVerkoop url="/koppelverkoop/" />
    }
  />
);
export default KoppelVerkoopPage;
