import React, { Component } from 'react';
import { format } from 'date-fns';
import SalesChart from '../../charts/SalesChart';
import IntervalDatePicker from '../IntervalDatePicker';
import RetrieveButton from '../../design/RetrieveButton';

class SalesInfoWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      interval: 'hour',
      retrieve: false,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
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

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleRetrieveButton();
    }
  };

  renderSalesChart() {
    return (
      <SalesChart
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        start={format(this.state.startDate, 'yyyy-MM-dd')}
        end={format(this.state.endDate, 'yyyy-MM-dd')}
        interval={this.state.interval}
        onLoaded={this.onLoaded}
      />
    );
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyDown}>
        <IntervalDatePicker
          onChangeStartDate={this.handleStartDateChange}
          onChangeEndDate={this.handleEndDateChange}
          OnIntervalChange={this.handleIntervalChange}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          interval={this.state.interval}
          useInterval
        />
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={this.state.retrieve}
        />
        {this.renderSalesChart()}
      </div>
    );
  }
}

export default SalesInfoWrapper;
