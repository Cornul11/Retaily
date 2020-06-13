import React from 'react';
import { shallow } from 'enzyme';
import SalesInfo from '../../components/input/SalesInfo';
import Wrapper from '../../components/input/Wrapper';

describe('shallow SalesInfo', () => {
  const salesInfo = shallow(<SalesInfo />);
  it('should render the Wrapper', () => {
    expect(salesInfo.find(Wrapper).exists()).toBeTruthy();
  });
  it('should render saleType select', () => {
    expect(salesInfo.find('select.form-control').exists()).toBeTruthy();
  });
  describe('select identifier button', () => {
    it('should be have value customer', () => {
      expect(salesInfo.find('select.form-control').props().value).toBe('customers');
    });
    it('should be have state customers', () => {
      expect(salesInfo.state('saleType')).toBe('customers');
    });
  });
});

describe('shallow SalesInfo when changing saleType', () => {
  const salesInfo = shallow(<SalesInfo />);
  describe('select identifier button', () => {
    const select = salesInfo.find('select.form-control');
    select.simulate('change', { target: { value: 'revenue' } });
    it('should be have value revenue', () => {
      expect(salesInfo.find('select.form-control').props().value).toBe('revenue');
    });
    it('should be have state revenue', () => {
      expect(salesInfo.state('saleType')).toBe('revenue');
    });
  });
});

describe('retrieve on enter', () => {
  const salesInfo = shallow(<SalesInfo />);
  const spy = jest.spyOn(salesInfo.instance(), 'retrieveInChild');
  salesInfo.find('div').first().simulate('keydown', { key: 'Enter' });
  it('retrieveInChild should be called one time', () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
