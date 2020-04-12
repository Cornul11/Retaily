import React, { Component } from "react";
import DatePicker from "../DatePicker";
import ProductSalesChart from "../../charts/productSalesChart";

class ProductSalesChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      interval: "hour",
      retrieve: false,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleIntervalChange(event) {
    this.setState({ interval: event.target.value });
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  renderIntervalSelect() {
    return (
      <select
        id="interval"
        value={this.state.interval}
        onChange={this.handleIntervalChange}
      >
        <option value="hour">hour</option>
        <option value="day">day</option>
      </select>
    );
  }

  renderSalesChart() {
    return (
      <ProductSalesChart
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        start={this.state.startDate}
        end={this.state.endDate}
        interval={this.state.interval}
        onLoaded={this.onLoaded}
      />
    );
  }

  render() {
    return (
      <div>
        <h1>Start Date</h1>
        <DatePicker onChange={this.handleStartDateChange} />
        <h1>End Date</h1>
        <DatePicker onChange={this.handleEndDateChange} />
        <h1>Interval</h1>
        {this.renderIntervalSelect()}
        <div>
          <button onClick={this.handleRetrieveButton}>retrieve</button>
        </div>
        {this.renderSalesChart()}
      </div>
    );
  }
}

export default ProductSalesChartWrapper;
