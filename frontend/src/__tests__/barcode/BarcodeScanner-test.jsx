import React from 'react';
import { shallow } from 'enzyme';
import BarcodeScanner from '../../components/barcode/BarcodeScanner';

describe('test state loaded', () => {
  let result = null;
  const onDetected = (data) => {
    result = data;
  };
  const scanner = shallow(<BarcodeScanner onDetected={onDetected} />);
  it('test data', () => {
    const test = { codeResult: { code: 1234 } };
    scanner.instance().onDetected(test);
    expect(result).toEqual(1234);
  });
});
