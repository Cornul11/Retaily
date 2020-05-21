import React, { Component } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
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
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { setRetrieve } = this.props;
    setRetrieve(this.handleRetrieveButton);
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

  handleIntervalChange(interval, startDate, endDate) {
    this.setState({
      startDate,
      endDate,
      interval,
    });
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
    this.clearErrorMessages();
  }

  handleError(error) {
    this.setState({ error });
  }

  renderSalesChart() {
    const {
      retrieve, startDate, endDate, interval,
    } = this.state;
    const { saleType } = this.props;
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
      error,
    } = this.state;
    return (
      <div role="textbox" tabIndex={0}>
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
        <RetrieveError
          error={error}
          handleError={this.handleError}
          setClear={(clear) => { this.clearErrorMessages = clear; }}
        />
        {this.renderSalesChart()}
      </div>
    );
  }
}

SalesInfoWrapper.propTypes = {
  setRetrieve: PropTypes.func.isRequired,
  saleType: PropTypes.string.isRequired,
};

export default SalesInfoWrapper;
