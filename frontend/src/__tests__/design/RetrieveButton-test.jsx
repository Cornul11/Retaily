import React from 'react';
import { shallow } from 'enzyme';
import RetrieveButton from '../../components/design/RetrieveButton';

describe('RetrieveButton while not retrieving', () => {
  let check = false;
  const retrieveButton = shallow(
    <RetrieveButton
      retrieve={false}
      handleRetrieveButton={() => { check = true; }}
    />,
  );
  it('should display retrieve', () => {
    expect(retrieveButton.containsMatchingElement(
      'Ophalen',
    )).toBeTruthy();
  });
  it('should NOT display loading spinner', () => {
    expect(retrieveButton.containsMatchingElement(
      <span className="sr-only">Bezig met laden...</span>,
    )).toBeFalsy();
  });
  it('button should NOT be disabled', () => {
    expect(retrieveButton.find('button.disabled').exists()).toBeFalsy();
  });
  it('should call handleRetrieveButton onClick', () => {
    expect(check).toEqual(false);
    retrieveButton.find('button.btn').simulate('click');
    expect(check).toEqual(true);
  });
});

describe('RetrieveButton while retrieving', () => {
  const retrieveButton = shallow(
    <RetrieveButton
      retrieve
      handleRetrieveButton={() => { }}
    />,
  );
  it('should display loading spinner', () => {
    expect(retrieveButton.containsMatchingElement(
      <span className="sr-only">Bezig met laden...</span>,
    )).toBeTruthy();
  });
  it('should NOT display retrieve', () => {
    expect(retrieveButton.containsMatchingElement(
      'Ophalen',
    )).toBeFalsy();
  });
  it('button should be disabled', () => {
    expect(retrieveButton.find('button.disabled').exists()).toBeTruthy();
  });
});

describe('RetrieveButton after transitioning to retrieving', () => {
  const retrieveButton = shallow(
    <RetrieveButton
      retrieve={false}
      handleRetrieveButton={() => { }}
    />,
  );
  retrieveButton.setProps({ retrieve: true });
  it('should display loading spinner', () => {
    expect(retrieveButton.containsMatchingElement(
      <span className="sr-only">Bezig met laden...</span>,
    )).toBeTruthy();
  });
  it('should NOT display retrieve', () => {
    expect(retrieveButton.containsMatchingElement(
      'Ophalen',
    )).toBeFalsy();
  });
  it('button should be disabled', () => {
    expect(retrieveButton.find('button.disabled').exists()).toBeTruthy();
  });
});
