import React, { Component } from "react";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: "",
      month: "",
      day: "",
    };
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  digitsOnly(string) {
    if (string.length === 0) {
      return true;
    }
    return string.match(/^[0-9]+$/);
  }

  onChange() {
    this.props.onChange(
      this.state.year + "-" + this.state.month + "-" + this.state.day
    );
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
      <div>
        <div>
          <p>Year</p>
          <input
            type="text"
            value={this.state.year}
            onChange={this.handleYearChange}
          />
        </div>
        <div>
          <p>Month</p>
          <input
            type="text"
            value={this.state.month}
            onChange={this.handleMonthChange}
          />
        </div>
        <div>
          <p>Day</p>
          <input
            type="text"
            value={this.state.day}
            onChange={this.handleDayChange}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
