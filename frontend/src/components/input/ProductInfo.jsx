import React, { Component } from 'react';
import ProductAutosuggest from './ProductAutosuggest';
import Scanner from '../barcode/Scanner';
import ProductSalesChartWrapper from './wrappers/ProductSalesChartWrapper';
import ProductInfoTableWrapper from './wrappers/ProductInfoTableWrapper';
import '../charts/App.css';

/** Component that retrieves information about an individual product */

const ProductInfo = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: 'plu',
      text: '',
      scanning: false,
      chartType: 'productInfoTable',
    };
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextChangeByAutosuggest = this.handleTextChangeByAutosuggest.bind(
      this,
    );
    this.handleScanButton = this.handleScanButton.bind(this);
    this.onDetected = this.onDetected.bind(this);
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value, text: '' });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value, scanning: false });
  }

  handleTextChangeByAutosuggest(text) {
    this.setState({ text });
  }

  handleScanButton() {
    this.setState((prevState) => ({ scanning: !prevState.scanning }));
  }

  onDetected(result) {
    this.setState({ scanning: false, text: result });
    this.retrieveInChild();
  }

  scanButtonText() {
    if (this.state.scanning) {
      return 'stop scanner';
    }
    return 'start scanner';
  }

  handleChartTypeChange(event) {
    this.setState({ chartType: event.target.value });
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
    if (this.state.identifier === 'name') {
      return (
        <ProductAutosuggest
          text={this.state.text}
          onTextChangeAuto={this.handleTextChangeByAutosuggest}
          onTextChange={this.handleTextChange}
        />
      );
    }
    return (
      <input
        type="text"
        value={this.state.text}
        className="form-control"
        placeholder={this.props.extended ? '' : 'EAN-code'}
        onChange={this.handleTextChange}
      />
    );
  }

  renderScanButton() {
    if (this.state.identifier === 'plu') {
      if (this.props.extended) {
        return (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.handleScanButton}
          >
            {this.scanButtonText()}
          </button>
        );
      }
      if (!this.state.scanning) {
        return (
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block mb-2"
            onClick={this.handleScanButton}
          >
            {this.scanButtonText()}
          </button>
        );
      }
    }
    return null;
  }

  renderScanner() {
    if (this.state.scanning === true) {
      return (
        <div onClick={this.handleScanButton}>
          <Scanner onDetected={this.onDetected} />
        </div>
      );
    }
    return null;
  }

  renderSelectChartType() {
    return (
      <select
        id="chartType"
        value={this.state.chartType}
        onChange={this.handleChartTypeChange}
        className="form-control"
      >
        <option value="productInfoTable">current product information</option>
        <option value="productSales">product sales</option>
      </select>
    );
  }

  renderProductInfoTableWrapper() {
    if (this.state.chartType === 'productInfoTable') {
      return (
        <ProductInfoTableWrapper
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

  renderProductSalesChartWrapper() {
    if (this.state.chartType === 'productSales') {
      return (
        <ProductSalesChartWrapper
          identifier={this.state.identifier}
          text={this.state.text}
          setRetrieve={(retrieve) => (this.retrieveInChild = retrieve)}
        />
      );
    }
    return null;
  }

  render() {
    if (this.props.extended) {
      return (
        <div onKeyDown={this.handleKeyDown}>
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
    /* Less options, but easier to use */
    return (
      <div onKeyDown={this.handleKeyDown}>
        {this.renderScanButton()}
        {this.renderScanner()}
        <center>
          {this.renderInputText()}
          {this.renderProductInfoTableWrapper()}
        </center>
      </div>
    );
  }
};

export default ProductInfo;
