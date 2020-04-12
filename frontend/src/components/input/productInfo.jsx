import React, { Component } from "react";
import Scanner from "../barcode/scanner";
import ProductSalesChartWrapper from "./wrappers/productSalesChartWrapper";
import ProductInfoTableWrapper from "./wrappers/productInfoTableWrapper";

/** Component that retrieves information about an individual product */

class ProductInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: "plu",
      text: "",
      scanning: false,
      chartType: "productInfoTable",
    };
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleScanButton = this.handleScanButton.bind(this);
    this.onDetected = this.onDetected.bind(this);
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
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
        <option value="productSales">product sales</option>
      </select>
    );
  }

  renderProductInfoTableWrapper() {
    if (this.state.chartType === "productInfoTable") {
      return (
        <ProductInfoTableWrapper
          identifier={this.state.identifier}
          text={this.state.text}
        />
      );
    }
    return null;
  }

  renderProductSalesChartWrapper() {
    if (this.state.chartType === "productSales") {
      return (
        <ProductSalesChartWrapper
          identifier={this.state.identifier}
          text={this.state.text}
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
        {this.renderProductInfoTableWrapper()}
        {this.renderProductSalesChartWrapper()}
      </div>
    );
  }
}

export default ProductInfo;
