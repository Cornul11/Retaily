import React, { Component } from 'react';

class RetrieveButton extends Component {
  renderSpinner() {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  render() {
    return (
      <button
        type="button"
        className={`btn btn-secondary mt-2 mb-2 btn-block ${
          this.props.retrieve ? 'disabled' : ''
        }`}
        onClick={this.props.handleRetrieveButton}
      >
        {this.props.retrieve ? this.renderSpinner() : 'retrieve'}
      </button>
    );
  }
}

export default RetrieveButton;
