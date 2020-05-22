import React, { Component } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import IntervalDatePicker from '../IntervalDatePicker';
import ProductInfoTable from '../../charts/ProductInfoTable';
import KoppelVerkoopTable from '../../charts/KoppelVerkoopTable';
import SalesChart from '../../charts/SalesChart';
import RetrieveButton from '../../design/RetrieveButton';
import RetrieveError from '../../design/RetrieveError';

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      interval: 'day',
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

  decideRender() {
    const { wrapperType } = this.props;
    if (wrapperType === 'salesChart') {
      return this.renderSalesChart();
    }
    if (wrapperType === 'productInfo') {
      return this.renderProductInfoTable();
    }
    if (wrapperType === 'koppelverkoop') {
      return this.renderKoppelVerkoopTable();
    }
    if (wrapperType === 'productSalesChart') {
      return this.renderProductSalesChart();
    }
    return null;
  }

  renderSalesChart() {
    const {
      retrieve, startDate, endDate, interval,
    } = this.state;
    const { saleType } = this.props;
    return (
      <SalesChart
        retrieve={retrieve}
        identifier={null}
        text={null}
        start={format(startDate, 'yyyy-MM-dd')}
        end={format(endDate, 'yyyy-MM-dd')}
        interval={interval}
        onError={this.handleError}
        onLoaded={this.onLoaded}
        saleType={saleType}
      />
    );
  }

  renderProductSalesChart() {
    const {
      retrieve, startDate, endDate, interval,
    } = this.state;
    const { identifier, text } = this.props;
    return (
      <SalesChart
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

  renderKoppelVerkoopTable() {
    const { retrieve, startDate, endDate } = this.state;
    const { identifier, text } = this.props;
    return (
      <KoppelVerkoopTable
        retrieve={retrieve}
        identifier={identifier}
        text={text}
        start={format(startDate, 'yyyy-MM-dd')}
        end={format(endDate, 'yyyy-MM-dd')}
        onLoaded={this.onLoaded}
        onError={this.handleError}
      />
    );
  }

  renderProductInfoTable() {
    const { retrieve } = this.state;
    const { identifier, text, extended } = this.props;
    return (
      <ProductInfoTable
        retrieve={retrieve}
        identifier={identifier}
        text={text}
        onLoaded={this.onLoaded}
        onError={this.handleError}
        extended={extended}
      />
    );
  }

  render() {
    const {
      retrieve, startDate, endDate, interval, error,
    } = this.state;
    const { wrapperType } = this.props;
    return (
      <div>
        {wrapperType !== 'productInfo'
          ? (
            <IntervalDatePicker
              onChangeStartDate={this.handleStartDateChange}
              onChangeEndDate={this.handleEndDateChange}
              OnIntervalChange={this.handleIntervalChange}
              startDate={startDate}
              endDate={endDate}
              interval={interval}
              useInterval={wrapperType !== 'koppelverkoop'}
            />
          ) : ''}
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={retrieve}
        />
        <RetrieveError
          error={error}
          handleError={this.handleError}
          setClear={(clear) => { this.clearErrorMessages = clear; }}
        />
        {this.decideRender()}
      </div>
    );
  }
}

Wrapper.propTypes = {
  saleType: PropTypes.string,
  setRetrieve: PropTypes.func.isRequired,
  identifier: PropTypes.string,
  text: PropTypes.string,
  extended: PropTypes.bool,
  wrapperType: PropTypes.string.isRequired,
};

Wrapper.defaultProps = {
  saleType: '',
  identifier: '',
  text: '',
  extended: false,
};

export default Wrapper;
