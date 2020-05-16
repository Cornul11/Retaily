import React, { Component } from 'react';
import KoppelVerkoopTableWrapper from './wrappers/KoppelVerkoopTableWrapper';

/** Component that retrieves koppelverkoop information about an individual product */

class KoppelVerkoopInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: 'plu',
      text: '',
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.retrieveInChild();
    }
  }

  renderInputText() {
    const { text } = this.state;
    return (
      <input
        type="text"
        id="plu-input"
        value={text}
        className="form-control"
        placeholder="EAN-code"
        onChange={this.handleTextChange}
      />
    );
  }

  renderKoppelVerkoopTableWrapper() {
    const { identifier, text } = this.state;
    return (
      <KoppelVerkoopTableWrapper
        id="table-wrapper"
        identifier={identifier}
        text={text}
        setRetrieve={(retrieve) => { this.retrieveInChild = retrieve; }}
      />
    );
  }

  render() {
    return (
      <div role="textbox" tabIndex={0} onKeyDown={this.handleKeyDown}>
        <center>
          {this.renderInputText()}
          {this.renderKoppelVerkoopTableWrapper()}
        </center>
      </div>
    );
  }
}

export default KoppelVerkoopInfo;
