import React, { Component } from 'react';
import { format } from 'date-fns';
import SalesChart from '../../charts/SalesChart';
import IntervalDatePicker from '../IntervalDatePicker';
import RetrieveButton from '../../design/RetrieveButton';
import RetrieveError from '../../design/RetrieveError';

class SalesInfoWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      interval: 'hour',
      retrieve: false,
      error: '',
      saleType: 'customers',
    };
    this.handleSaleTypeChange = this.handleSaleTypeChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  handleSaleTypeChange(event) {
    this.setState({ saleType: event.target.value });
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleIntervalChange(interval, startDate, endDate) {
    this.setState({
      startDate,
      endDate,
      interval,
    });
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.retrieveInChild();
    }
  }

  handleError(error) {
    this.setState({ error });
  }

  renderSalesChart() {
    const {
      retrieve, startDate, endDate, interval, saleType,
    } = this.state;
    return (
      <SalesChart
        retrieve={retrieve}
        start={format(startDate, 'yyyy-MM-dd')}
        end={format(endDate, 'yyyy-MM-dd')}
        interval={interval}
        onError={this.handleError}
        onLoaded={this.onLoaded}
        saleType={saleType}
      />
    );
  }

  render() {
    const {
      retrieve,
      startDate,
      endDate,
      interval,
      saleType,
      error,
    } = this.state;
    return (
      <div role="textbox" tabIndex={0} onKeyDown={this.handleKeyDown}>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              Transactie Cijfers
            </span>
          </div>
          <select
            id="saleType"
            value={saleType}
            onChange={this.handleSaleTypeChange}
            className="form-control"
          >
            <option value="customers">Klanten</option>
            <option value="revenue">Omzet</option>
          </select>
        </div>
        <IntervalDatePicker
          onChangeStartDate={this.handleStartDateChange}
          onChangeEndDate={this.handleEndDateChange}
          OnIntervalChange={this.handleIntervalChange}
          startDate={startDate}
          endDate={endDate}
          interval={interval}
          useInterval
        />
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={retrieve}
        />
        <RetrieveError error={error} handleError={this.handleError} />
        {this.renderSalesChart()}
      </div>
    );
  }
}

export default SalesInfoWrapper;
