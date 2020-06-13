import React from 'react';
import { shallow } from 'enzyme';
import RetrieveError from '../../components/design/RetrieveError';

describe('RetrieveError with no errors', () => {
  const clear = () => { };
  let handleTest = 0;
  const retrieveButton = shallow(
    <RetrieveError
      error=""
      setClear={clear}
      handleError={() => { handleTest += 1; }}
    />,
  );
  it('should not display any errors', () => {
    expect(retrieveButton.find('div.alert').exists()).toBeFalsy();
  });
  it('should not call handleError', () => {
    expect(handleTest).toBe(0);
  });
});

describe('RetrieveError with 1 error', () => {
  let handleTest = 0;
  const retrieveButton = shallow(
    <RetrieveError
      error=""
      setClear={() => { }}
      handleError={() => { handleTest += 1; }}
    />,
  );
  retrieveButton.setProps({ error: 'Connection problem' });
  it('should display an error', () => {
    expect(retrieveButton.find('div.alert').text()).toBe('Fout: Connection problem');
  });
  it('should have called handleError one time', () => {
    expect(handleTest).toBe(1);
  });
});

describe('RetrieveError after clearing errors', () => {
  let clearErrorMessages = () => { };
  let handleTest = 0;
  const retrieveButton = shallow(
    <RetrieveError
      error=""
      setClear={(clear) => { clearErrorMessages = clear; }}
      handleError={() => { handleTest += 1; }}
    />,
  );
  retrieveButton.setProps({ error: 'Connection problem' });
  /* This next line is normally done by handleError, but since it won't perform
     the prop updates in the testing envirement, we test it with handleTest  */
  retrieveButton.setProps({ error: '' });
  /* Likewise clearErrorMessages is normally called when the user clicks on the
     RetrieveButton */
  clearErrorMessages();
  it('should not display any errors', () => {
    expect(retrieveButton.find('div.alert').exists()).toBeFalsy();
  });
  it('should have called handleError one time', () => {
    expect(handleTest).toBe(1);
  });
});

describe('RetrieveError after adding and removing multiple errors', () => {
  let clearErrorMessages = () => { };
  let handleTest = 0;
  const retrieveButton = shallow(
    <RetrieveError
      error=""
      setClear={(clear) => { clearErrorMessages = clear; }}
      handleError={() => { handleTest += 1; }}
    />,
  );
  retrieveButton.setProps({ error: 'Connection problem' });
  retrieveButton.setProps({ error: '' });

  clearErrorMessages();
  retrieveButton.setProps({ error: 'hello' });
  retrieveButton.setProps({ error: '' });

  clearErrorMessages();
  retrieveButton.setProps({ error: 'bye' });
  retrieveButton.setProps({ error: '' });

  it('should display the last error', () => {
    expect(retrieveButton.find('div.alert').text()).toBe('Fout: bye');
  });
  it('should have called handleError three times', () => {
    expect(handleTest).toBe(3);
  });
});
