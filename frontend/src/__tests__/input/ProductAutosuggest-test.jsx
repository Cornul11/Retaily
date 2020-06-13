import React from 'react';
import { shallow } from 'enzyme';
import ProductAutosuggest from '../../components/input/ProductAutosuggest';

describe('test onSuggestionsClearRequested function', () => {
  const wrapper = shallow(<ProductAutosuggest
    text=""
    onTextChangeAuto={() => {}}
    onTextChange={() => {}}
  />);
  it('should set suggestions to empty', () => {
    wrapper.instance().setState({ suggestions: ['test'] }, async () => {
      await wrapper.instance().onSuggestionsClearRequested();
      expect(wrapper.instance().state.suggestions).toEqual([]);
    });
  });
});

describe('test onSuggestionSelectedByUser function', () => {
  let result = '';
  const wrapper = shallow(<ProductAutosuggest
    text=""
    onTextChangeAuto={(value) => { result = value; }}
    onTextChange={() => {}}
  />);
  it('expect to have been called with test', async () => {
    let e;
    const test = { suggestionValue: 'test' };
    wrapper.instance().onSuggestionSelectedByUser(e, test);
    expect(result).toEqual('test');
  });
});

describe('test handleTextChange function', () => {
  let result = '';
  const wrapper = shallow(<ProductAutosuggest
    text=""
    onTextChangeAuto={() => {}}
    onTextChange={(value) => { result = value; }}
  />);
  it('expect to have been called with test', async () => {
    const e = 'test';
    wrapper.instance().handleTextChange(e);
    expect(result).toEqual('test');
  });
});

describe('test fillProductsArray function', () => {
  const wrapper = shallow(<ProductAutosuggest
    text=""
    onTextChangeAuto={() => {}}
    onTextChange={() => {}}
  />);
  const data = [
    { name: 'Product 1' },
    { name: 'Product 2' },
    { name: 'Product 3' },
  ];
  global.fetch = jest.fn();
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  }));
  it('should store data in products', async () => {
    await wrapper.instance().fillProductsArray();
    expect(wrapper.instance().state.products).toEqual(data);
  });
  it('test onSuggestionsFetchRequested function', async () => {
    let test = {
      value: {
        trim: () => '',
      },
    };
    await wrapper.instance().onSuggestionsFetchRequested(test);
    expect(wrapper.instance().state.suggestions).toEqual([]);

    test = {
      value: {
        trim: () => 'Product',
      },
    };
    await wrapper.instance().onSuggestionsFetchRequested(test);
    expect(wrapper.instance().state.suggestions).toEqual([
      { name: 'Product 1' },
      { name: 'Product 2' },
      { name: 'Product 3' },
    ]);

    test = {
      value: {
        trim: () => 'Product 1',
      },
    };
    await wrapper.instance().onSuggestionsFetchRequested(test);
    expect(wrapper.instance().state.suggestions).toEqual([{ name: 'Product 1' }]);
  });
});
