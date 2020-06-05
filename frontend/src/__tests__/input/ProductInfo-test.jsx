import React from 'react';
import { shallow } from 'enzyme';
import ProductInfo from '../../components/input/ProductInfo';
import BarcodeScanner from '../../components/barcode/BarcodeScanner';
import Wrapper from '../../components/input/Wrapper';
import ProductAutosuggest from '../../components/input/ProductAutosuggest';

describe('simple ProductInfo (not extended) not showing scanner', () => {
  const productInfo = shallow(<ProductInfo extended={false} />);
  it('should display the scanner button', () => {
    expect(productInfo.find('button.btn-primary').exists()).toBeTruthy();
  });
  it('The scanner should display the start scanner text', () => {
    expect(productInfo.containsMatchingElement(
      <button type="button">
        Start scanner
      </button>,
    )).toBeTruthy();
  });
  it('should not render the scanner', () => {
    expect(productInfo.find(BarcodeScanner).exists()).toBeFalsy();
  });
  it('should render input select', () => {
    expect(productInfo.find('input.form-control').exists()).toBeTruthy();
  });
  it('should render the productInfoTable', () => {
    expect(productInfo.find(Wrapper).exists()).toBeTruthy();
    expect(productInfo.state('chartType')).toBe('productInfoTable');
  });
  const select = productInfo.find('select.selectChart');
  it('should not render select chart type', () => {
    expect(select.exists()).toBeFalsy();
  });
  it('should not render autosuggest', () => {
    expect(productInfo.find(ProductAutosuggest).exists()).toBeFalsy();
  });
});

describe('simple ProductInfo (not extended) showing scanner', () => {
  const productInfo = shallow(<ProductInfo extended={false} />);
  productInfo.find('button.btn').simulate('click');
  it('should display the scanner button', () => {
    expect(productInfo.find('button.btn-primary').exists()).toBeTruthy();
  });
  it('The scanner should display the stop scanner text', () => {
    expect(productInfo.containsMatchingElement(
      <button type="button">
        Stop scanner
      </button>,
    )).toBeTruthy();
  });
  it('should render the scanner', () => {
    expect(productInfo.find(BarcodeScanner).exists()).toBeTruthy();
  });
});

describe('extended ProductInfo', () => {
  const productInfo = shallow(<ProductInfo extended />);
  describe('select identifier button', () => {
    const select = productInfo.find('select.btn-primary');
    it('should render', () => {
      expect(select.exists()).toBeTruthy();
    });
    it('should have default value plu', () => {
      expect(select.props().value).toBe('plu');
    });
  });
  it('should display the scanner button', () => {
    expect(productInfo.find('button.btn-secondary').exists()).toBeTruthy();
  });
  it('The scanner should display the start scanner text', () => {
    expect(productInfo.containsMatchingElement(
      <button type="button">
        Start scanner
      </button>,
    )).toBeTruthy();
  });
  it('should not render the scanner', () => {
    expect(productInfo.find(BarcodeScanner).exists()).toBeFalsy();
  });
  it('should render input select', () => {
    expect(productInfo.find('input.form-control').exists()).toBeTruthy();
  });
  describe('select chart type', () => {
    const select = productInfo.find('select.selectChart');
    it('should render', () => {
      expect(select.exists()).toBeTruthy();
    });
    it('should have default value productInfoTable', () => {
      expect(select.props().value).toBe('productInfoTable');
    });
  });
  it('should render the productInfoTable', () => {
    expect(productInfo.find(Wrapper).exists()).toBeTruthy();
    expect(productInfo.state('chartType')).toBe('productInfoTable');
  });
});

describe('extended ProductInfo showing scanner', () => {
  const productInfo = shallow(<ProductInfo extended />);
  productInfo.find('button.btn').simulate('click');
  it('should display the scanner button', () => {
    expect(productInfo.find('button.btn-secondary').exists()).toBeTruthy();
  });
  it('The scanner should display the stop scanner text', () => {
    expect(productInfo.containsMatchingElement(
      <button type="button">
        Stop scanner
      </button>,
    )).toBeTruthy();
  });
  it('should render the scanner', () => {
    expect(productInfo.find(BarcodeScanner).exists()).toBeTruthy();
  });
});

describe('extended ProductInfo changing identifier', () => {
  const productInfo = shallow(<ProductInfo extended />);
  describe('select identifier button', () => {
    const select = productInfo.find('select.btn-primary');
    select.simulate('change', { target: { value: 'name' } });
    it('should be have value name', () => {
      expect(productInfo.find('select.btn-primary').props().value).toBe('name');
    });
    it('should render autosuggest', () => {
      expect(productInfo.find(ProductAutosuggest).exists()).toBeTruthy();
    });
  });
});

describe('extended ProductInfo changing chartType', () => {
  const productInfo = shallow(<ProductInfo extended />);
  describe('productSales', () => {
    const select = productInfo.find('select.selectChart');
    select.simulate('change', { target: { value: 'productSales' } });
    it('should be have value productSales', () => {
      expect(productInfo.find('select.selectChart').props().value).toBe('productSales');
    });
    it('should render the productSales', () => {
      expect(productInfo.find(Wrapper).exists()).toBeTruthy();
      expect(productInfo.state('chartType')).toBe('productSales');
    });
  });
});

describe('extended ProductInfo changing chartType', () => {
  const productInfo = shallow(<ProductInfo extended />);
  describe('productSales', () => {
    const select = productInfo.find('select.selectChart');
    select.simulate('change', { target: { value: 'koppelverkoop' } });
    it('should be have value koppelverkoop', () => {
      expect(productInfo.find('select.selectChart').props().value).toBe('koppelverkoop');
    });
    it('should render the koppelverkoop', () => {
      expect(productInfo.find(Wrapper).exists()).toBeTruthy();
      expect(productInfo.state('chartType')).toBe('koppelverkoop');
    });
  });
});

describe('retrieve on enter', () => {
  const productInfo = shallow(<ProductInfo extended />);
  const spy = jest.spyOn(productInfo.instance(), 'retrieveInChild');
  productInfo.find('div').first().simulate('keydown', { key: 'Enter' });
  it('retrieveInChild should be called one time', () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('test onDetected function', () => {
  const productInfo = shallow(<ProductInfo extended />);
  const spy = jest.spyOn(productInfo.instance(), 'retrieveInChild');
  const val = '2532';
  productInfo.instance().onDetected(val);
  it('should close the scanner', () => {
    expect(productInfo.state('scanning')).toBe(false);
    expect(productInfo.find(BarcodeScanner).exists()).toBeFalsy();
  });
  it('should set the result in the inputfield', () => {
    expect(productInfo.state('text')).toBe(val);
    expect(productInfo.find('input.form-control').props().value).toBe(val);
  });
  it('retrieveInChild should be called one time', () => {
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('test handleTextChange function', () => {
  const productInfo = shallow(<ProductInfo extended />);
  productInfo.find('button.btn').simulate('click');
  const input = productInfo.find('input.form-control');
  input.simulate('change', { target: { value: '124' } });
  it('scanner should be closed again', () => {
    expect(productInfo.state('scanning')).toBe(false);
    expect(productInfo.find(BarcodeScanner).exists()).toBeFalsy();
  });
  it('target value should be in state', () => {
    expect(productInfo.state('text')).toBe('124');
  });
});
describe('test handleScanButton function', () => {
  const productInfo = shallow(<ProductInfo extended />);
  productInfo.find('button.btn').simulate('click');
  productInfo.find('button.btn').simulate('click');
  it('tscanner should be closed', () => {
    expect(productInfo.state('scanning')).toBe(false);
    expect(productInfo.find(BarcodeScanner).exists()).toBeFalsy();
  });
});
