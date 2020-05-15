import React, { Component } from 'react';
import { format } from 'date-fns';
import IntervalDatePicker from '../IntervalDatePicker';
import KoppelVerkoopTable from '../../charts/KoppelVerkoopTable';
import RetrieveButton from '../../design/RetrieveButton';

class KoppelVerkoopTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      retrieve: false,
    };
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  componentDidMount() {
    this.props.setRetrieve(this.handleRetrieveButton);
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

  renderKoppelVerkoopTable() {
    return (
      <KoppelVerkoopTable
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        start={format(this.state.startDate, 'yyyy-MM-dd')}
        end={format(this.state.endDate, 'yyyy-MM-dd')}
        onLoaded={this.onLoaded}
        extended={this.props.extended}
      />
    );
  }

  render() {
    return (
      <div>
        <IntervalDatePicker
          onChangeStartDate={this.handleStartDateChange}
          onChangeEndDate={this.handleEndDateChange}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={this.state.retrieve}
        />
        {this.renderKoppelVerkoopTable()}
      </div>
    );
  }
}

export default KoppelVerkoopTableWrapper;
