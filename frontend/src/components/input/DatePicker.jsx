import React, { Component } from 'react';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: '',
      month: '',
      day: '',
    };
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  onChange() {
    this.props.onChange(
      `${this.state.year}-${this.state.month}-${this.state.day}`,
    );
  }

  digitsOnly(string) {
    if (string.length === 0) {
      return true;
    }
    return string.match(/^[0-9]+$/);
  }

  handleYearChange(event) {
    if (event.target.value.length < 5 && this.digitsOnly(event.target.value)) {
      this.setState({ year: event.target.value }, this.onChange);
    }
  }

  handleMonthChange(event) {
    if (event.target.value.length < 3 && this.digitsOnly(event.target.value)) {
      this.setState({ month: event.target.value }, this.onChange);
    }
  }

  handleDayChange(event) {
    if (event.target.value.length < 3 && this.digitsOnly(event.target.value)) {
      this.setState({ day: event.target.value }, this.onChange);
    }
  }

  render() {
    return (
      <div className="input-group mt-2">
        <div className="input-group-prepend" id="button-addon3">
          <span className="input-group-text" id="basic-addon1">{this.props.label}</span>
        </div>
        <input
          type="text"
          value={this.state.day}
          onChange={this.handleDayChange}
          className="form-control"
          placeholder="day"
        />
        <input
          type="text"
          value={this.state.month}
          onChange={this.handleMonthChange}
          className="form-control"
          placeholder="month"
        />
        <input
          type="text"
          value={this.state.year}
          onChange={this.handleYearChange}
          className="form-control"
          placeholder="year"
        />
      </div>
    );
  }
}

export default DatePicker;
