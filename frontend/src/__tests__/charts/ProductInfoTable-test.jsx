import React from 'react';
import { shallow } from 'enzyme';
import ProductInfoTable from '../../components/charts/ProductInfoTable';

describe('test getEmptyData function', () => {
  const wrapper = shallow(<ProductInfoTable
    extended
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
  />);
  it('should create an extended empty dataset', () => {
    const emptyDataExtended = {
      PLU: null,
      Naam: null,
      Inkoopprijs: null,
      Verkoopprijs: null,
      Winstmarge: null,
      'Verkocht afgelopen week': null,
      'Verkocht afgelopen maand': null,
      'Verkocht afgelopen kwartaal': null,
      'Verkocht afgelopen jaar': null,
    };
    expect(wrapper.instance().getEmptyData()).toEqual(emptyDataExtended);
  });
  it('should create a non-extended empty dataset', () => {
    wrapper.setProps({ extended: false }, () => {
      const emptyData = {
        PLU: null,
        Naam: null,
        'Verkocht afgelopen week': null,
        'Verkocht afgelopen maand': null,
        'Verkocht afgelopen kwartaal': null,
        'Verkocht afgelopen jaar': null,
      };
      expect(wrapper.instance().getEmptyData()).toEqual(emptyData);
    });
  });
});

describe('test retrieveProductData function', () => {
  const data = {
    buying_price: 2.44,
    name: 'SUIKERBROOD KLEIN',
    plu: 2532,
    selling_price: 3.4,
  };
  let error = 'no error';
  global.fetch = jest.fn();
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  }));
  const wrapper = shallow(<ProductInfoTable
    extended
    retrieve={false}
    onLoaded={() => {}}
    onError={(e) => { error = e; }}
    identifier="testid"
    text="testtext"
  />);
  const emptyDataExtended = {
    PLU: null,
    Naam: null,
    Inkoopprijs: null,
    Verkoopprijs: null,
    Winstmarge: null,
    'Verkocht afgelopen week': null,
    'Verkocht afgelopen maand': null,
    'Verkocht afgelopen kwartaal': null,
    'Verkocht afgelopen jaar': null,
  };
  wrapper.setState({ newData: emptyDataExtended });
  it('should have updated the state', async () => {
    const newData = {
      PLU: 2532,
      Naam: 'SUIKERBROOD KLEIN',
      Inkoopprijs: 2.44,
      Verkoopprijs: 3.4,
      Winstmarge: '39.34%',
      'Verkocht afgelopen week': null,
      'Verkocht afgelopen maand': null,
      'Verkocht afgelopen kwartaal': null,
      'Verkocht afgelopen jaar': null,
    };
    await wrapper.instance().retrieveProductData();
    expect(wrapper.instance().state.newData).toEqual(newData);
  });
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    text: () => Promise.resolve('{ "message": "error msg" }'),
    json: () => Promise.resolve(data),
  }));
  it('should expect error message', async () => {
    await wrapper.instance().retrieveProductData();
    expect(error).toEqual('error msg');
  });
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    text: () => Promise.resolve(),
    json: () => Promise.resolve(data),
  }));
  it('should expect no error message', async () => {
    await wrapper.instance().retrieveProductData();
    expect(error).toEqual('Verbinding mislukt');
  });
});

describe('test retrieveSalesData function', () => {
  const data = {
    sales_last_month: 0,
    sales_last_quarter: 51,
    sales_last_week: 0,
    sales_last_year: 238,
  };
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  }));
  const wrapper = shallow(<ProductInfoTable
    extended
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
  />);
  const emptyData = {
    PLU: null,
    Naam: null,
    'Verkocht afgelopen week': null,
    'Verkocht afgelopen maand': null,
    'Verkocht afgelopen kwartaal': null,
    'Verkocht afgelopen jaar': null,
  };
  wrapper.setState({ newData: emptyData });
  it('should have updated the state', async () => {
    const newData = {
      PLU: null,
      Naam: null,
      'Verkocht afgelopen week': 0,
      'Verkocht afgelopen maand': 0,
      'Verkocht afgelopen kwartaal': 51,
      'Verkocht afgelopen jaar': 238,
    };
    await wrapper.instance().retrieveSalesData();
    expect(wrapper.instance().state.newData).toEqual(newData);
  });
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    text: () => Promise.resolve('{ "message": "error msg" }'),
    json: () => Promise.resolve(data),
  }));
});

describe('test renderTable function', () => {
  const wrapper = shallow(<ProductInfoTable
    extended
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
  />);
  it('should create an extended table', () => {
    const dataExtended = {
      PLU: 1,
      Naam: 2,
      Inkoopprijs: 3,
      Verkoopprijs: 4,
      Winstmarge: 5,
      'Verkocht afgelopen week': 6,
      'Verkocht afgelopen maand': 7,
      'Verkocht afgelopen kwartaal': 8,
      'Verkocht afgelopen jaar': 9,
    };
    wrapper.setState({ data: dataExtended }, () => {
      const expected = [
        <tr key={0}>
          <th scope="row">PLU</th>
          <td>{1}</td>
        </tr>,
        <tr key={1}>
          <th scope="row">Naam</th>
          <td>{2}</td>
        </tr>,
        <tr key={2}>
          <th scope="row">Inkoopprijs</th>
          <td>{3}</td>
        </tr>,
        <tr key={3}>
          <th scope="row">Verkoopprijs</th>
          <td>{4}</td>
        </tr>,
        <tr key={4}>
          <th scope="row">Winstmarge</th>
          <td>{5}</td>
        </tr>,
        <tr key={5}>
          <th scope="row">Verkocht afgelopen week</th>
          <td>{6}</td>
        </tr>,
        <tr key={6}>
          <th scope="row">Verkocht afgelopen maand</th>
          <td>{7}</td>
        </tr>,
        <tr key={7}>
          <th scope="row">Verkocht afgelopen kwartaal</th>
          <td>{8}</td>
        </tr>,
        <tr key={8}>
          <th scope="row">Verkocht afgelopen jaar</th>
          <td>{9}</td>
        </tr>,
      ];
      expect(wrapper.instance().renderTable()).toEqual(expected);
    });
  });
  it('should create a non-extended table', () => {
    const data = {
      PLU: 1,
      Naam: 2,
      'Verkocht afgelopen week': 3,
      'Verkocht afgelopen maand': 4,
      'Verkocht afgelopen kwartaal': 5,
      'Verkocht afgelopen jaar': 6,
    };
    wrapper.setState({ extended: false, data }, () => {
      const expected = [
        <tr key={0}>
          <th scope="row">PLU</th>
          <td>{1}</td>
        </tr>,
        <tr key={1}>
          <th scope="row">Naam</th>
          <td>{2}</td>
        </tr>,
        <tr key={2}>
          <th scope="row">Verkocht afgelopen week</th>
          <td>{3}</td>
        </tr>,
        <tr key={3}>
          <th scope="row">Verkocht afgelopen maand</th>
          <td>{4}</td>
        </tr>,
        <tr key={4}>
          <th scope="row">Verkocht afgelopen kwartaal</th>
          <td>{5}</td>
        </tr>,
        <tr key={5}>
          <th scope="row">Verkocht afgelopen jaar</th>
          <td>{6}</td>
        </tr>,
      ];
      expect(wrapper.instance().renderTable()).toEqual(expected);
    });
  });
});

describe('test render function', () => {});
