import React, { Component } from 'react';
import Wrapper from './wrappers/Wrapper';

const SalesInfo = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saleType: 'customers',
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSaleTypeChange = this.handleSaleTypeChange.bind(this);
  }

  handleSaleTypeChange(event) {
    this.setState({ saleType: event.target.value });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.retrieveInChild();
    }
  }

  renderSaleTypeSelect() {
    const { saleType } = this.state;
    return (
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            Transactie Cijfers
          </span>
        </div>
        <select
          id="saleType"
          value={saleType}
          onChange={this.handleSaleTypeChange}
          className="form-control"
        >
          <option value="customers">Klanten</option>
          <option value="revenue">Omzet</option>
        </select>
      </div>
    );
  }

  render() {
    const { saleType } = this.state;
    return (
      <div role="textbox" tabIndex={0} onKeyDown={this.handleKeyDown}>
        {this.renderSaleTypeSelect()}
        <Wrapper
          wrapperType="salesChart"
          setRetrieve={(retrieve) => {
            this.retrieveInChild = retrieve;
          }}
          saleType={saleType}
        />
      </div>
    );
  }
};

export default SalesInfo;
