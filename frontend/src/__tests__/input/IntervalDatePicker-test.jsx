import React from 'react';
import { shallow, mount } from 'enzyme';
import DatePicker from 'react-datepicker';
import IntervalDatePicker from '../../components/input/IntervalDatePicker';

describe('IntervalDatePicker without interval picker', () => {
  let startDate = new Date(2012, 5, 15);
  let endDate = new Date();
  const intervalDatePicker = shallow(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
    />,
  );
  it('should render 2 DatePickers', () => {
    expect(intervalDatePicker.find(DatePicker)).toHaveLength(2);
  });
  it('should NOT render the IntervalPicker', () => {
    expect(intervalDatePicker.find('div.invisible').exists()).toBeTruthy();
  });
});

describe('test filterDate function', () => {
  let startDate = new Date();
  let endDate = new Date();
  let interval = 'week';
  const intervalDatePicker = mount(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
      usInterval
      onIntervalChange={(i, sd, ed) => { interval = i; startDate = sd; endDate = ed; }}
      interval={interval}
    />,
  );
  describe('week interval', () => {
    const res = intervalDatePicker.instance().filterDate(new Date(2020, 5, 9));
    it('9-06-2020 should not be selectable with week interval', () => {
      expect(res).toBe(false);
    });
    const res2 = intervalDatePicker.instance().filterDate(new Date(2020, 5, 8));
    it('8-06-2020 should be selectable with week interval', () => {
      expect(res2).toBe(true);
    });
  });
  describe('month interval', () => {
    intervalDatePicker.setProps({ interval: 'month' });
    const res3 = intervalDatePicker.instance().filterDate(new Date(2020, 5, 8));
    it('9-06-2020 should not be selectable with month interval', () => {
      expect(res3).toBe(false);
    });
    const res4 = intervalDatePicker.instance().filterDate(new Date(2020, 5, 1));
    it('8-06-2020 should be selectable with month interval', () => {
      expect(res4).toBe(true);
    });
  });
  describe('day interval', () => {
    intervalDatePicker.setProps({ interval: 'day' });
    const res5 = intervalDatePicker.instance().filterDate(new Date(2020, 5, 17));
    it('9-06-2020 should not be selectable', () => {
      expect(res5).toBe(true);
    });
    const res6 = intervalDatePicker.instance().filterDate(new Date(2020, 5, 21));
    it('8-06-2020 should be selectable', () => {
      expect(res6).toBe(true);
    });
  });
});


describe('IntervalDatePicker with interval picker', () => {
  let startDate = new Date(2020, 5, 17);
  let endDate = new Date(2020, 5, 21);
  let interval = 'day';
  const intervalDatePicker = shallow(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
      usInterval
      onIntervalChange={(i, sd, ed) => { interval = i; startDate = sd; endDate = ed; }}
      interval={interval}
    />,
  );
  intervalDatePicker.update();
  it('should render 2 DatePickers', () => {
    expect(intervalDatePicker.find(DatePicker)).toHaveLength(2);
  });
  describe('Change interval to week', () => {
    const select = intervalDatePicker.find('select');
    select.simulate('change', { target: { value: 'week' } });
    it('should set the interval to week', () => {
      expect(interval).toBe('week');
    });
    it('should set the correct startDate', () => {
      expect(startDate).toStrictEqual(new Date(2020, 5, 15));
    });
    it('should set the correct endDate ', () => {
      expect(endDate).toStrictEqual(new Date(2020, 5, 22));
    });
  });
});

describe('IntervalDatePicker with interval picker (part 2)', () => {
  let startDate = new Date(2020, 5, 17);
  let endDate = new Date(2020, 5, 21);
  let interval = 'day';
  const intervalDatePicker = shallow(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
      usInterval
      onIntervalChange={(i, sd, ed) => { interval = i; startDate = sd; endDate = ed; }}
      interval={interval}
    />,
  );
  describe('Change interval to month', () => {
    const select = intervalDatePicker.find('select');
    select.simulate('change', { target: { value: 'month' } });
    it('should set the interval to month', () => {
      expect(interval).toBe('month');
    });
    it('should set the correct startDate', () => {
      expect(startDate).toStrictEqual(new Date(2020, 5, 1));
    });
    it('should set the correct endDate ', () => {
      expect(endDate).toStrictEqual(new Date(2020, 6, 1));
    });
  });
});

describe('IntervalDatePicker with interval picker (part 3)', () => {
  let startDate = new Date(2020, 5, 17);
  let endDate = new Date(2020, 5, 21);
  let interval = 'day';
  const intervalDatePicker = shallow(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
      usInterval
      onIntervalChange={(i, sd, ed) => { interval = i; startDate = sd; endDate = ed; }}
      interval={interval}
    />,
  );
  describe('Change interval to hour', () => {
    const select = intervalDatePicker.find('select');
    select.simulate('change', { target: { value: 'hour' } });
    it('should set the interval to hour', () => {
      expect(interval).toBe('hour');
    });
    it('should set the correct startDate', () => {
      expect(startDate).toStrictEqual(new Date(2020, 5, 17));
    });
    it('should set the correct endDate ', () => {
      expect(endDate).toStrictEqual(new Date(2020, 5, 21));
    });
  });
});

describe('IntervalDatePicker with interval picker (part 4)', () => {
  let startDate = new Date(2020, 5, 17);
  let endDate = new Date(2020, 5, 21);
  let interval = 'day';
  const intervalDatePicker = shallow(
    <IntervalDatePicker
      onChangeStartDate={(date) => { startDate = date; }}
      onChangeEndDate={(date) => { endDate = date; }}
      startDate={startDate}
      endDate={endDate}
      usInterval
      onIntervalChange={(i, sd, ed) => { interval = i; startDate = sd; endDate = ed; }}
      interval={interval}
    />,
  );
  describe('Change interval to half an hour', () => {
    const select = intervalDatePicker.find('select');
    select.simulate('change', { target: { value: 'half_an_hour' } });
    it('should set the interval to half_an_hour', () => {
      expect(interval).toBe('half_an_hour');
    });
    it('should set the correct startDate', () => {
      expect(startDate).toStrictEqual(new Date(2020, 5, 17));
    });
    it('should set the correct endDate ', () => {
      expect(endDate).toStrictEqual(new Date(2020, 5, 21));
    });
  });
});
