import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, getDay, addDays } from "date-fns";
import nl from "date-fns/locale/nl";
import KoppelVerkoopTable from "../../charts/KoppelVerkoopTable";

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
        start={format(this.state.startDate, "yyyy-MM-dd")}
        end={format(this.state.endDate, "yyyy-MM-dd")}
        onLoaded={this.onLoaded}
        extended={this.props.extended}
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
        <button
          type="button"
          className="btn btn-secondary mt-2 mb-2 btn-block"
          onClick={this.handleRetrieveButton}
        >
          retrieve
        </button>
        {this.renderKoppelVerkoopTable()}
      </div>
    );
  }
}

export default KoppelVerkoopTableWrapper;
