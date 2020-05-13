import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDay, addDays } from "date-fns";
import nl from "date-fns/locale/nl";

class IntervalDatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.filterDate = this.filterDate.bind(this);
  }

  handleStartDateChange(date) {
    this.props.onChangeStartDate(date);
  }

  handleEndDateChange(date) {
    this.props.onChangeEndDate(date);
  }

  handleIntervalChange(event) {
    let startDate = new Date(this.props.startDate);
    let endDate = new Date(this.props.endDate);
    if (event.target.value === "week") {
      while (getDay(startDate) !== 1) {
        startDate = addDays(startDate, -1);
      }
      while (getDay(endDate) !== 1) {
        endDate = addDays(endDate, 1);
      }
    }
    if (event.target.value === "month") {
      while (startDate.getDate() !== 1) {
        startDate = addDays(startDate, -1);
      }
      while (endDate.getDate() !== 1) {
        endDate = addDays(endDate, 1);
      }
    }
    this.props.OnIntervalChange(event.target.value, startDate, endDate);
  }

  filterDate(date) {
    if (this.props.interval === "week") {
      return getDay(date) === 1;
    }
    if (this.props.interval === "month") {
      return date.getDate() === 1;
    }
    return true;
  }

  renderIntervalSelect() {
    return (
      <div className="input-group mt-2">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            Interval
          </span>
        </div>
        <select
          id="interval"
          value={this.props.interval}
          onChange={this.handleIntervalChange}
          className="form-control"
        >
          <option value="half_an_hour">half an hour</option>
          <option value="hour">hour</option>
          <option value="day">day</option>
          <option value="week">week</option>
          <option value="month">month</option>
        </select>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="input-group justify-content-center">
          <div className="card text-center mt-2 mr-md-3">
            <div className="card-header">start date</div>
            <div className="card-body">
              <DatePicker
                selected={this.props.startDate}
                onChange={this.handleStartDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                maxDate={this.props.endDate}
                locale={nl}
                showWeekNumbers={this.props.interval === "week" ? true : false}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
          <div className="card text-center mt-2">
            <div className="card-header">end date</div>
            <div className="card-body">
              <DatePicker
                selected={this.props.endDate}
                onChange={this.handleEndDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                minDate={this.props.startDate}
                locale={nl}
                showWeekNumbers={this.props.interval === "week" ? true : false}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
        </div>
        {this.props.useInterval ? this.renderIntervalSelect() : ""}
      </div>
    );
  }
}

export default IntervalDatePicker;
