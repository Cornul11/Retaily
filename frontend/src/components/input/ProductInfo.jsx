import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductAutosuggest from './ProductAutosuggest';
import BarcodeScanner from '../barcode/BarcodeScanner';
import Wrapper from './Wrapper';

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
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.retrieveInChild = () => { };
  }

  onDetected(result) {
    this.setState({ scanning: false, text: result });
    this.retrieveInChild();
  }

  handleScanButton() {
    this.setState((prevState) => ({ scanning: !prevState.scanning }));
  }

  handleTextChangeByAutosuggest(text) {
    this.setState({ text });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value, scanning: false });
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value });
  }

  scanButtonText() {
    const { scanning } = this.state;
    if (scanning) {
      return 'Stop scanner';
    }
    return 'Start scanner';
  }

  handleChartTypeChange(event) {
    this.setState({ chartType: event.target.value });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.retrieveInChild();
    }
  }

  renderSelectIdentifier() {
    const { identifier } = this.state;
    return (
      <select
        id="identifier"
        value={identifier}
        onChange={this.handleIdentifierChange}
        className="form-control btn btn-primary"
      >
        <option value="plu">PLU</option>
        <option value="name">Naam</option>
      </select>
    );
  }

  renderInputText() {
    const { identifier, text } = this.state;
    const { extended } = this.props;
    if (identifier === 'name') {
      return (
        <ProductAutosuggest
          text={text}
          onTextChangeAuto={this.handleTextChangeByAutosuggest}
          onTextChange={this.handleTextChange}
        />
      );
    }
    return (
      <input
        type="number"
        value={text}
        className="form-control"
        placeholder={extended ? '' : 'PLU van product'}
        onChange={this.handleTextChange}
      />
    );
  }

  renderScanButton() {
    const { extended } = this.props;
    const { identifier } = this.state;
    if (identifier === 'plu') {
      return (
        <button
          type="button"
          className={
            extended
              ? 'btn btn-secondary'
              : 'btn btn-primary btn-lg btn-block mb-2'
          }
          onClick={this.handleScanButton}
        >
          {this.scanButtonText()}
        </button>
      );
    }
    return null;
  }

  renderScanner() {
    const { scanning } = this.state;
    if (scanning === true) {
      return (
        <div>
          <BarcodeScanner onDetected={this.onDetected} />
        </div>
      );
    }
    return null;
  }

  renderSelectChartType() {
    const { chartType } = this.state;
    return (
      <select
        id="chartType"
        value={chartType}
        onChange={this.handleChartTypeChange}
        className="selectChart form-control"
      >
        <option value="productInfoTable">Huidige informatie</option>
        <option value="productSales">Verkoopcijfers</option>
        <option value="koppelverkoop">Koppelverkoop</option>
      </select>
    );
  }

  renderProductInfoTableWrapper() {
    const { chartType, identifier, text } = this.state;
    const { extended } = this.props;
    if (chartType === 'productInfoTable') {
      return (
        <Wrapper
          wrapperType="productInfo"
          id="table-wrapper"
          identifier={identifier}
          text={text}
          extended={extended}
          setRetrieve={(retrieve) => {
            this.retrieveInChild = retrieve;
          }}
        />
      );
    }
    return null;
  }

  renderProductSalesChartWrapper() {
    const { chartType, identifier, text } = this.state;
    if (chartType === 'productSales') {
      return (
        <Wrapper
          wrapperType="productSalesChart"
          identifier={identifier}
          text={text}
          setRetrieve={(retrieve) => {
            this.retrieveInChild = retrieve;
          }}
        />
      );
    }
    return null;
  }

  renderKoppelVerkoopTableWrapper() {
    const { identifier, text, chartType } = this.state;
    if (chartType === 'koppelverkoop') {
      return (
        <Wrapper
          wrapperType="koppelverkoop"
          id="table-wrapper"
          identifier={identifier}
          text={text}
          setRetrieve={(retrieve) => {
            this.retrieveInChild = retrieve;
          }}
        />
      );
    }
    return null;
  }

  render() {
    const { extended } = this.props;
    if (extended) {
      return (
        <div role="textbox" tabIndex={-1} onKeyDown={this.handleKeyDown}>
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
          {this.renderKoppelVerkoopTableWrapper()}
        </div>
      );
    }
    /* Less options, but easier to use */
    return (
      <div role="textbox" tabIndex={-1} onKeyDown={this.handleKeyDown}>
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

ProductInfo.propTypes = { extended: PropTypes.bool.isRequired };

export default ProductInfo;
