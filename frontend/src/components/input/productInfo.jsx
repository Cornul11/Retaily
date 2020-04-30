import React, { Component } from "react";
import Scanner from "../barcode/scanner";
import ProductSalesChartWrapper from "./wrappers/productSalesChartWrapper";
import ProductInfoTableWrapper from "./wrappers/productInfoTableWrapper";
// import 'bootstrap/dist/css/bootstrap.min.css';

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
    if(!this.props.extended){
      this.state.scanning= true;
    }
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value });
  }

  handleTextChange(event) {
    //commented out the two scanning: false parts because I needed to refresh to the page to scan again
    //this.setState({ text: event.target.value, scanning: false });
    this.setState({ text: event.target.value });
  }

  handleScanButton() {
    this.setState({ scanning: !this.state.scanning });
  }

  onDetected(result) {
    //this.setState({ scanning: false, text: result });
    this.setState({ text: result });
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
        className={"form-control btn btn-primary"}
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
        className="form-control "
        placeholder={(this.props.extended ? "" : "EAN-code")}
        onChange={this.handleTextChange}
      />
    );
  }

  renderScanButton() {
    if (this.state.identifier === "plu") {
      return (
        <button className="btn btn-secondary" onClick={this.handleScanButton}>{this.scanButtonText()}</button>
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
        className={"form-control"}
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
          extended={this.props.extended}
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
    if(this.props.extended){
      return(
        <div>
          <div className="input-group mb-2">
            <div className="input-group-prepend">
              {this.renderSelectIdentifier()}
            </div>
            {this.renderInputText()}
            {this.renderScanButton()}
          </div>
          {this.renderScanner()}
          {this.renderSelectChartType()}
          {this.renderProductInfoTableWrapper()}
          {this.renderProductSalesChartWrapper()}
        </div>
      );
    }
    else{
      /* Less options, but easier to use */
      return(
        <div>
          {this.renderScanner()}
          <center>
            {this.renderInputText()}
            {this.renderProductInfoTableWrapper()}
          </center>
        </div>
      );

    }
  
  }
}

export default ProductInfo;
