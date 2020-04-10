import React, { Component } from "react";
import Scanner from "../barcode/scanner";
import ProductInfoTable from "./productInfoTable";

/** Component that retrieves information about an individual product */

class ProductInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: "plu",
      text: "",
      scanning: false,
      chartType: "productInfoTable",
      retrieve: false,
    };
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleScanButton = this.handleScanButton.bind(this);
    this.onDetected = this.onDetected.bind(this);
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value, scanning: false });
  }

  handleScanButton() {
    this.setState({ scanning: !this.state.scanning });
  }

  onDetected(result) {
    this.setState({ scanning: false, text: result });
  }

  scanButtonText() {
    if (this.state.scanning) {
      return "stop scanner";
    } else {
      return "start scanner";
    }
  }

  handleChartTypeChange(event) {
    this.setState({ chartType: event.target.value });
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  renderSelectIdentifier() {
    return (
      <select
        id="identifier"
        value={this.state.identifier}
        onChange={this.handleIdentifierChange}
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
        value={this.state.text}
        onChange={this.handleTextChange}
      />
    );
  }

  renderScanButton() {
    if (this.state.identifier === "plu") {
      return (
        <button onClick={this.handleScanButton}>{this.scanButtonText()}</button>
      );
    }
    return null;
  }

  renderScanner() {
    if (this.state.scanning === true) {
      return <Scanner onDetected={this.onDetected} />;
    }
    return null;
  }

  renderSelectChartType() {
    return (
      <select
        id="chartType"
        value={this.state.chartType}
        onChange={this.handleChartTypeChange}
      >
        <option value="productInfoTable">current product information</option>
      </select>
    );
  }

  renderRetrieveButton() {
    return <button onClick={this.handleRetrieveButton}>retrieve</button>;
  }

  renderProductInfoTable() {
    if (this.state.chartType === "productInfoTable") {
      return (
        <ProductInfoTable
          retrieve={this.state.retrieve}
          identifier={this.state.identifier}
          text={this.state.text}
          onLoaded={this.onLoaded}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.renderSelectIdentifier()}
        {this.renderInputText()}
        {this.renderScanButton()}
        {this.renderScanner()}
        {this.renderSelectChartType()}
        {this.renderRetrieveButton()}
        {this.renderProductInfoTable()}
      </div>
    );
  }
}

export default ProductInfo;
