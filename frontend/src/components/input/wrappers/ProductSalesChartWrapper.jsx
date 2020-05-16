import React, { Component } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ProductSalesChart from '../../charts/ProductSalesChart';
import IntervalDatePicker from '../IntervalDatePicker';
import RetrieveButton from '../../design/RetrieveButton';
import RetrieveError from '../../design/RetrieveError';

class ProductSalesChartWrapper extends Component {
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
  }

  handleError(error) {
    this.setState({ error });
  }

  renderSalesChart() {
    const {
      retrieve, startDate, endDate, interval,
    } = this.state;
    const { identifier, text } = this.props;
    return (
      <ProductSalesChart
        retrieve={retrieve}
        identifier={identifier}
        text={text}
        start={format(startDate, 'yyyy-MM-dd')}
        end={format(endDate, 'yyyy-MM-dd')}
        interval={interval}
        onError={this.handleError}
        onLoaded={this.onLoaded}
      />
    );
  }

  render() {
    const {
      retrieve, startDate, endDate, interval, error,
    } = this.state;
    return (
      <div>
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
        />
        {this.renderSalesChart()}
      </div>
    );
  }
}

ProductSalesChartWrapper.propTypes = { identifier: PropTypes.string.isRequired };
ProductSalesChartWrapper.propTypes = { text: PropTypes.string.isRequired };
ProductSalesChartWrapper.propTypes = { setRetrieve: PropTypes.func.isRequired };

export default ProductSalesChartWrapper;
