import React, { Component } from "react";
import KoppelVerkoopTableWrapper from "./wrappers/KoppelVerkoopTableWrapper";

/** Component that retrieves koppelverkoop information about an individual product */

class KoppelVerkoopInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: "plu",
      text: "",
      chartType: "koppelVerkoopTable",
    };

    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.onDetected = this.onDetected.bind(this);
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
  }

  onDetected(result) {
    this.setState({ text: result });
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleScanButton() {
    this.setState({ scanning: !this.state.scanning });
  }

  handleChartTypeChange(event) {
    this.setState({ chartType: event.target.value });
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.retrieveInChild();
    }
  };

  renderSelectIdentifier() {
    return (
      <select
        id="identifier"
        value={this.state.identifier}
        onChange={this.handleIdentifierChange}
        className="form-control btn btn-primary"
      >
        <option value="plu">plu</option>
        <option value="name">name</option>
      </select>
    );
  }

  renderInputText() {
    return (
      <input
        type="text"
        id="plu-input"
        value={this.state.text}
        className="form-control"
        placeholder={this.props.extended ? "" : "EAN-code"}
        onChange={this.handleTextChange}
      />
    );
  }

  renderSelectChartType() {
    return (
      <select
        id="chartType"
        value={this.state.chartType}
        onChange={this.handleChartTypeChange}
        className="form-control"
      >
        <option value="koppelVerkoopTable">current product information</option>
      </select>
    );
  }

  renderKoppelVerkoopTableWrapper() {
    if (this.state.chartType === "koppelVerkoopTable") {
      return (
        <KoppelVerkoopTableWrapper
          id="table-wrapper"
          identifier={this.state.identifier}
          text={this.state.text}
          extended={this.props.extended}
          setRetrieve={(retrieve) => (this.retrieveInChild = retrieve)}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyDown}>
        <center>
          {this.renderInputText()}
          {this.renderKoppelVerkoopTableWrapper()}
        </center>
      </div>
    );
  }
}

export default KoppelVerkoopInfo;
