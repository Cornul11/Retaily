import React, { Component } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import IntervalDatePicker from '../IntervalDatePicker';
import KoppelVerkoopTable from '../../charts/KoppelVerkoopTable';
import RetrieveButton from '../../design/RetrieveButton';
import RetrieveError from '../../design/RetrieveError';

class KoppelVerkoopTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      retrieve: false,
      error: '',
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.handleError = this.handleError.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
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

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  handleError(error) {
    this.setState({ error });
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

  render() {
    const {
      retrieve, startDate, endDate, error,
    } = this.state;
    return (
      <div>
        <IntervalDatePicker
          onChangeStartDate={this.handleStartDateChange}
          onChangeEndDate={this.handleEndDateChange}
          startDate={startDate}
          endDate={endDate}
        />
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={retrieve}
        />
        <RetrieveError
          error={error}
          handleError={this.handleError}
        />
        {this.renderKoppelVerkoopTable()}
      </div>
    );
  }
}

KoppelVerkoopTableWrapper.propTypes = { setRetrieve: PropTypes.func.isRequired };
KoppelVerkoopTableWrapper.propTypes = { identifier: PropTypes.string.isRequired };
KoppelVerkoopTableWrapper.propTypes = { text: PropTypes.string.isRequired };

export default KoppelVerkoopTableWrapper;
