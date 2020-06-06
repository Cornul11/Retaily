import React from 'react';
import { shallow, mount } from 'enzyme';
import SalesChart from '../../components/charts/SalesChart';

describe('retrieve when retrieve prop is true', () => {
  let retrieve = false;
  const salesChart = shallow(<SalesChart
    retrieve={retrieve}
    identifier=""
    text=""
    onLoaded={() => { retrieve = false; }}
    onError={() => {}}
    start=""
    end=""
    interval=""
  />);
  salesChart.instance().loadChart = jest.fn();
  salesChart.setProps({ retrieve: true });
  it('should be called one time', () => {
    expect(salesChart.instance().loadChart).toHaveBeenCalledTimes(1);
  });
  it('should set retrieve to false', () => {
    expect(retrieve).toEqual(false);
  });
});

describe('test createURL', () => {
  const salesChart = shallow(<SalesChart
    retrieve={false}
    identifier=""
    text=""
    onLoaded={() => {}}
    onError={() => {}}
    start="start"
    end="end"
    interval="interval"
  />);
  it('should exclude identifier and text', () => {
    expect(salesChart.instance().createURL()).toEqual(
      'https://retaily.site:7000/verkoop/?=&start=start&end=end&interval=interval',
    );
  });
  it('should include identifier and text', () => {
    salesChart.setProps({ identifier: 'identifier', text: 'text' });
    expect(salesChart.instance().createURL()).toEqual(
      'https://retaily.site:7000/verkoop/?identifier=text&start=start&end=end&interval=interval',
    );
  });
});

describe('test fetchData', () => {
  const data = [{ t: '2020', y: 100 }, { t: '2021', y: 200 }];
  global.fetch = jest.fn();
  fetch.mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data),
  }));
  const salesChart = shallow(<SalesChart
    retrieve={false}
    identifier=""
    text=""
    onLoaded={() => {}}
    onError={() => {}}
    start=""
    end=""
    interval=""
  />);
  it('test fetchData', async () => {
    const result = await salesChart.instance().fetchData('url');
    expect(result).toEqual(data);
  });
});

describe('test roundData', () => {
  const salesChart = shallow(<SalesChart
    retrieve
    identifier=""
    text=""
    onLoaded={() => {}}
    onError={() => {}}
    start=""
    end=""
    interval=""
  />);
  it('test roundData', () => {
    salesChart.instance().setState({ data: [{ t: '2020', y: 100.123 }, { t: '2021', y: 200.456 }] });
    salesChart.instance().roundData();
    expect(salesChart.instance().state.data).toEqual([{ t: '2020', y: '100.12' }, { t: '2021', y: '200.46' }]);
  });
});
