import React from 'react';
import { shallow } from 'enzyme';
import Wrapper from '../../components/input/Wrapper';
import ProductInfoTable from '../../components/charts/ProductInfoTable';
import RetrieveButton from '../../components/design/RetrieveButton';
import RetrieveError from '../../components/design/RetrieveError';
import IntervalDatePicker from '../../components/input/IntervalDatePicker';
import KoppelVerkoopTable from '../../components/charts/KoppelVerkoopTable';
import SalesChart from '../../components/charts/SalesChart';

describe('productInfo Wrapper', () => {
  let retrieve = () => { };
  const wrapper = shallow(<Wrapper
    wrapperType="productInfo"
    id="table-wrapper"
    identifier=""
    text=""
    extended
    setRetrieve={(r) => {
      retrieve = r;
    }}
  />);

  it('should render the ProductInfoTable', () => {
    expect(wrapper.find(ProductInfoTable).exists()).toBeTruthy();
  });
  it('should NOT render the KoppelVerkooptable', () => {
    expect(wrapper.find(KoppelVerkoopTable).exists()).toBeFalsy();
  });
  it('should NOT render the SalesChart', () => {
    expect(wrapper.find(SalesChart).exists()).toBeFalsy();
  });

  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveButton).exists()).toBeTruthy();
  });
  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveError).exists()).toBeTruthy();
  });
  it('should NOT render the IntervalDatePicker', () => {
    expect(wrapper.find(IntervalDatePicker).exists()).toBeFalsy();
  });

  describe('testing handleRetrieveButton', () => {
    const spy = jest.spyOn(wrapper.instance(), 'clearErrorMessages');
    retrieve();
    it('clearErrorMessages should be called one time', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('retrieve in state should be true', () => {
      expect(wrapper.state('retrieve')).toBe(true);
    });
  });

  describe('testing handleStartDateChange', () => {
    const date = new Date(6, 12, 2000);
    wrapper.instance().handleStartDateChange(date);
    it('start date in state should be 6/12/2000', () => {
      expect(wrapper.state('startDate')).toStrictEqual(date);
    });
  });

  describe('testing handleEndDateChange', () => {
    const date = new Date(1, 15, 2010);
    wrapper.instance().handleEndDateChange(date);
    it('end date in state should be 1/15/2010', () => {
      expect(wrapper.state('endDate')).toStrictEqual(date);
    });
  });

  describe('testing handleError', () => {
    const error = 'fout';
    wrapper.instance().handleError(error);
    it('error in state should be fout', () => {
      expect(wrapper.state('error')).toEqual(error);
    });
  });
});

describe('Koppelverkoop Wrapper', () => {
  let retrieve = () => { };
  const wrapper = shallow(<Wrapper
    wrapperType="koppelverkoop"
    id="table-wrapper"
    identifier=""
    text=""
    extended
    setRetrieve={(r) => {
      retrieve = r;
    }}
  />);

  it('should render the KoppelVerkooptable', () => {
    expect(wrapper.find(KoppelVerkoopTable).exists()).toBeTruthy();
  });
  it('should NOT render the ProductInfoTable', () => {
    expect(wrapper.find(ProductInfoTable).exists()).toBeFalsy();
  });
  it('should NOT render the SalesChart', () => {
    expect(wrapper.find(SalesChart).exists()).toBeFalsy();
  });

  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveButton).exists()).toBeTruthy();
  });
  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveError).exists()).toBeTruthy();
  });
  it('should render the IntervalDatePicker', () => {
    expect(wrapper.find(IntervalDatePicker).exists()).toBeTruthy();
  });

  describe('testing onLoaded', () => {
    retrieve();
    wrapper.instance().onLoaded();
    it('retrieve in state should be false', () => {
      expect(wrapper.state('retrieve')).toBe(false);
    });
  });

  describe('testing handleIntervalChange', () => {
    const interval = 'week';
    const startDate = new Date(2, 10, 2100);
    const endDate = new Date(21, 11, 4100);
    wrapper.instance().handleIntervalChange(interval, startDate, endDate);
    it('interval in state should be week', () => {
      expect(wrapper.state('interval')).toEqual(interval);
    });
    it('startDate in state should be 2/10/2100', () => {
      expect(wrapper.state('startDate')).toEqual(startDate);
    });
    it('endDate in state should be 21/11/4100', () => {
      expect(wrapper.state('endDate')).toEqual(endDate);
    });
  });
});

describe('Saleschart Wrapper', () => {
  const wrapper = shallow(<Wrapper
    wrapperType="salesChart"
    id="table-wrapper"
    identifier=""
    text=""
    extended
    setRetrieve={() => { }}
  />);

  it('should render the SalesChart', () => {
    expect(wrapper.find(SalesChart).exists()).toBeTruthy();
  });
  it('should NOT render the KoppelVerkooptable', () => {
    expect(wrapper.find(KoppelVerkoopTable).exists()).toBeFalsy();
  });
  it('should NOT render the ProductInfoTable', () => {
    expect(wrapper.find(ProductInfoTable).exists()).toBeFalsy();
  });

  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveButton).exists()).toBeTruthy();
  });
  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveError).exists()).toBeTruthy();
  });
  it('should render the IntervalDatePicker', () => {
    expect(wrapper.find(IntervalDatePicker).exists()).toBeTruthy();
  });
});

describe('Saleschart Wrapper', () => {
  const wrapper = shallow(<Wrapper
    wrapperType="productSalesChart"
    id="table-wrapper"
    identifier=""
    text=""
    extended
    setRetrieve={() => { }}
  />);

  it('should render the SalesChart', () => {
    expect(wrapper.find(SalesChart).exists()).toBeTruthy();
  });
  it('should NOT render the KoppelVerkooptable', () => {
    expect(wrapper.find(KoppelVerkoopTable).exists()).toBeFalsy();
  });
  it('should NOT render the ProductInfoTable', () => {
    expect(wrapper.find(ProductInfoTable).exists()).toBeFalsy();
  });

  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveButton).exists()).toBeTruthy();
  });
  it('should render the RetrieveButton', () => {
    expect(wrapper.find(RetrieveError).exists()).toBeTruthy();
  });
  it('should render the IntervalDatePicker', () => {
    expect(wrapper.find(IntervalDatePicker).exists()).toBeTruthy();
  });
});
