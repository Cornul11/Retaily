import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDay, addDays } from 'date-fns';
import nl from 'date-fns/locale/nl';
import PropTypes from 'prop-types';

class IntervalDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.filterDate = this.filterDate.bind(this);
  }

  handleStartDateChange(date) {
    const { onChangeStartDate } = this.props;
    onChangeStartDate(date);
  }

  handleEndDateChange(date) {
    const { onChangeEndDate } = this.props;
    onChangeEndDate(date);
  }

  handleIntervalChange(event) {
    const { startDate, endDate, OnIntervalChange } = this.props;
    let startDateF = new Date(startDate);
    let endDateF = new Date(endDate);
    if (event.target.value === 'week') {
      while (getDay(startDateF) !== 1) {
        startDateF = addDays(startDateF, -1);
      }
      while (getDay(endDateF) !== 1) {
        endDateF = addDays(endDateF, 1);
      }
    }
    if (event.target.value === 'month') {
      while (startDateF.getDate() !== 1) {
        startDateF = addDays(startDateF, -1);
      }
      while (endDateF.getDate() !== 1) {
        endDateF = addDays(endDateF, 1);
      }
    }
    OnIntervalChange(event.target.value, startDateF, endDateF);
  }

  filterDate(date) {
    const { interval } = this.props;
    if (interval === 'week') {
      return getDay(date) === 1;
    }
    if (interval === 'month') {
      return date.getDate() === 1;
    }
    return true;
  }

  renderIntervalSelect() {
    const { interval } = this.props;
    return (
      <div className="input-group mt-2">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            Interval
          </span>
        </div>
        <select
          id="interval"
          value={interval}
          onChange={this.handleIntervalChange}
          className="form-control"
        >
          <option value="half_an_hour">Half uur</option>
          <option value="hour">Uur</option>
          <option value="day">Dag</option>
          <option value="week">Week</option>
          <option value="month">Maand</option>
        </select>
      </div>
    );
  }

  render() {
    const {
      startDate, endDate, interval, useInterval,
    } = this.props;
    return (
      <div>
        <div className="input-group justify-content-center">
          <div className="card text-center mt-2 mr-md-3">
            <div className="card-header">start datum</div>
            <div className="card-body">
              <DatePicker
                selected={startDate}
                onChange={this.handleStartDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                maxDate={endDate}
                locale={nl}
                showWeekNumbers={interval === 'week'}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
          <div className="card text-center mt-2">
            <div className="card-header">eind datum</div>
            <div className="card-body">
              <DatePicker
                selected={endDate}
                onChange={this.handleEndDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                minDate={startDate}
                locale={nl}
                showWeekNumbers={interval === 'week'}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
        </div>
        {useInterval ? this.renderIntervalSelect() : ''}
      </div>
    );
  }
}

IntervalDatePicker.propTypes = {
  useInterval: PropTypes.bool,
  onChangeStartDate: PropTypes.func.isRequired,
  onChangeEndDate: PropTypes.func.isRequired,
  OnIntervalChange: PropTypes.func,
  startDate: PropTypes.objectOf(Date).isRequired,
  endDate: PropTypes.objectOf(Date).isRequired,
  interval: PropTypes.string,
};

IntervalDatePicker.defaultProps = {
  useInterval: false,
  interval: '',
  OnIntervalChange: () => {},
};

export default IntervalDatePicker;
