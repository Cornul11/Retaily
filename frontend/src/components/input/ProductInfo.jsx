import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Scanner from '../barcode/Scanner';
import ProductSalesChartWrapper from './wrappers/ProductSalesChartWrapper';
import ProductInfoTableWrapper from './wrappers/ProductInfoTableWrapper';
import '../charts/App.css';

/** Component that retrieves information about an individual product */

const products = [];

const escapeRegexCharacters = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getSuggestions = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp(`^${escapedValue}`, 'i');

  return products.filter((product) => regex.test(product.name));
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => (
  <span>
    {suggestion.name}
  </span>
);

/**
 * Decides whether to show suggestions or not.
 * Returns true only if the input size is larger than 2.
 * @param value the input of the user
 * @returns {boolean} whether to show the suggestions
 */
function shouldRenderSuggestions(value) {
  return value.trim().length > 2;
}

const ProductInfo = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: 'plu',
      text: '',
      scanning: false,
      chartType: 'productInfoTable',
      suggestions: [],
    };
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleScanButton = this.handleScanButton.bind(this);
    this.onDetected = this.onDetected.bind(this);
    this.handleChartTypeChange = this.handleChartTypeChange.bind(this);
    this.fillProductsArray();
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  }

  async fillProductsArray() {
    await fetch('/inventory/list', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(
        (response) => {
          for (const product in response) {
            products.push(response[product]);
          }
        },
        (error) => {
          console.log(error);
        },
      );
  }

  handleIdentifierChange(event) {
    this.setState({ identifier: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value, scanning: false });
  }

  handleScanButton() {
    this.setState((prevState) => ({ scanning: !prevState.scanning }));
  }

  onDetected(result) {
    this.setState({ scanning: false, text: result });
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

  onSuggestionSelectedByUser = (event, {
    suggestion, suggestionValue, suggestionIndex, sectionIndex, method,
  }) => {
    this.setState({ text: suggestionValue });
  };

  renderInputText() {
    if (this.state.identifier === 'name') {
      const value = this.state.text;
      const { suggestions } = this.state;
      const inputProps = {
        placeholder: 'Test input',
        value,
        onChange: this.handleTextChange,
      };
      return (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          shouldRenderSuggestions={shouldRenderSuggestions}
          onSuggestionSelected={this.onSuggestionSelectedByUser}
          inputProps={inputProps}
        />
      );
    }
    return (
      <input
        type="text"
        value={this.state.text}
        className="form-control"
        placeholder={(this.props.extended ? '' : 'EAN-code')}
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

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  renderProductInfoTableWrapper() {
    if (this.state.chartType === 'productInfoTable') {
      return (
        <ProductInfoTableWrapper
          id="table-wrapper"
          identifier={this.state.identifier}
          text={this.state.text}
          extended={this.props.extended}
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
        />
      );
    }
    return null;
  }

  render() {
    if (this.props.extended) {
      return (
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
    /* Less options, but easier to use */
    return (
      <div>
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
