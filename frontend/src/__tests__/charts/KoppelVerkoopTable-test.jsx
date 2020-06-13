import React from 'react';
import { shallow } from 'enzyme';
import KoppelVerkoopTable from '../../components/charts/KoppelVerkoopTable';

describe('test createURL function', () => {
  const wrapper = shallow(<KoppelVerkoopTable
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
    start="teststart"
    end="testend"
  />);
  it('should create URL corresponding to props', () => {
    expect(wrapper.instance().createURL()).toEqual(
      'https://retaily.site:7000/koppelverkoop/lijst/?testid=testtext&start=teststart&end=testend',
    );
  });
});

describe('test loadTable function', () => {
  const data = [
    {
      count: '',
      name: 'Geselecteerd Product: PRODUCT X',
    },
    {
      count: 6,
      name: 'PRODUCT Y',
    },
    {
      count: 11,
      name: 'PRODUCT Z',
    },
  ];
  let error = 'no error';
  let loaded = false;
  global.fetch = jest.fn();
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  }));
  const wrapper = shallow(<KoppelVerkoopTable
    retrieve={false}
    onLoaded={() => { loaded = true; }}
    onError={(e) => { error = e; }}
    identifier="testid"
    text="testtext"
    start="teststart"
    end="testend"
  />);
  it('should have updated the state', async () => {
    await wrapper.instance().loadTable();
    expect(wrapper.instance().state.data).toEqual(data);
    expect(loaded).toEqual(true);
  });
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    text: () => Promise.resolve('{ "message": "error msg" }'),
    json: () => Promise.resolve(data),
  }));
  loaded = false;
  it('should expect error message', async () => {
    await wrapper.instance().loadTable();
    expect(error).toEqual('error msg');
    expect(loaded).toEqual(true);
  });
  fetch.mockImplementationOnce(() => Promise.resolve({
    ok: false,
    text: () => Promise.resolve(),
    json: () => Promise.resolve(data),
  }));
  loaded = false;
  it('should expect no error message', async () => {
    await wrapper.instance().loadTable();
    expect(error).toEqual('Verbinding mislukt');
    expect(loaded).toEqual(true);
  });
});

describe('test renderTable function', () => {
  const wrapper = shallow(<KoppelVerkoopTable
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
    start="teststart"
    end="testend"
  />);
  it('should return null', () => {
    wrapper.setState({ data: undefined }, () => {
      expect(wrapper.instance().renderTable()).toEqual(null);
    });
  });
  it('should return null', () => {
    wrapper.instance().setState({ data: null }, () => {
      expect(wrapper.instance().renderTable()).toEqual(null);
    });
  });
  it('should return null', () => {
    wrapper.instance().setState({ data: [] }, () => {
      expect(wrapper.instance().renderTable()).toEqual(null);
    });
  });

  const data = [
    {
      count: '',
      name: 'Geselecteerd Product: PRODUCT X',
    },
    {
      count: 6,
      name: 'PRODUCT Y',
    },
    {
      count: 11,
      name: 'PRODUCT Z',
    },
  ];
  it('should return a html table', () => {
    const expected = [
      <tr key="Geselecteerd Product: PRODUCT X" className="table-secondary">
        <th scope="row" colSpan="2" className="text-center">Geselecteerd Product: PRODUCT X</th>
      </tr>,
      <tr key="PRODUCT Y">
        <th>PRODUCT Y</th>
        <td>{6}</td>
      </tr>,
      <tr key="PRODUCT Z">
        <th>PRODUCT Z</th>
        <td>{11}</td>
      </tr>,
    ];
    wrapper.instance().setState({ data }, () => {
      expect(wrapper.instance().renderTable()).toEqual(expected);
    });
  });
});

describe('test render function', () => {
  const wrapper = shallow(<KoppelVerkoopTable
    retrieve={false}
    onLoaded={() => {}}
    onError={() => {}}
    identifier="testid"
    text="testtext"
    start="teststart"
    end="testend"
  />);
  it('should have rendered the divs', () => {
    wrapper.instance().render();
    expect(wrapper.find('.koppelVerkoopTable').exists()).toBeTruthy();
    expect(wrapper.find('.table').exists()).toBeTruthy();
  });
});
