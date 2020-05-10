import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, getDay, addDays } from "date-fns";
import nl from "date-fns/locale/nl";
import ProductSalesChart from "../../charts/ProductSalesChart";

class ProductSalesChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      interval: "hour",
      retrieve: false,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.filterDate = this.filterDate.bind(this);
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleIntervalChange(event) {
    this.setState({
      interval: event.target.value,
    });
    let startDate = new Date(this.state.startDate);
    let endDate = new Date(this.state.endDate);
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
    this.setState({ startDate: startDate, endDate: endDate });
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  filterDate(date) {
    if (this.state.interval === "week") {
      return getDay(date) === 1;
    }
    if (this.state.interval === "month") {
      return date.getDate() === 1;
    }
    return true;
  }

  renderIntervalSelect() {
    return (
      <select
        id="interval"
        value={this.state.interval}
        onChange={this.handleIntervalChange}
        className="form-control"
      >
        <option value="half_an_hour">half an hour</option>
        <option value="hour">hour</option>
        <option value="day">day</option>
        <option value="week">week</option>
        <option value="month">month</option>
      </select>
    );
  }

  renderSalesChart() {
    return (
      <ProductSalesChart
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        start={format(this.state.startDate, "yyyy-MM-dd")}
        end={format(this.state.endDate, "yyyy-MM-dd")}
        interval={this.state.interval}
        onLoaded={this.onLoaded}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="input-group justify-content-center">
          <div className="card text-center mt-2 mr-2">
            <div className="card-header">start date</div>
            <div className="card-body">
              <DatePicker
                selected={this.state.startDate}
                onChange={this.handleStartDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                maxDate={this.state.endDate}
                locale={nl}
                showWeekNumbers={this.state.interval === "week" ? true : false}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
          <div className="card text-center mt-2">
            <div className="card-header">end date</div>
            <div className="card-body">
              <DatePicker
                selected={this.state.endDate}
                onChange={this.handleEndDateChange}
                dateFormat="dd-MM-yyyy"
                inline
                minDate={this.state.startDate}
                locale={nl}
                showWeekNumbers={this.state.interval === "week" ? true : false}
                showMonthDropdown
                filterDate={this.filterDate}
              />
            </div>
          </div>
        </div>
        <div className="input-group mt-2">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              Interval
            </span>
          </div>
          {this.renderIntervalSelect()}
        </div>
        <button
          type="button"
          className="btn btn-secondary mt-2 btn-block"
          onClick={this.handleRetrieveButton}
        >
          retrieve
        </button>
        {this.renderSalesChart()}
      </div>
    );
  }
}

export default ProductSalesChartWrapper;
