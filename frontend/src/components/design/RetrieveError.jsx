import React, { Component } from 'react';
import PropTypes from 'prop-types';

const RetrieveError = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessages: [],
      index: 0,
    };
    this.clearMessages = this.clearMessages.bind(this);
  }

  componentDidMount() {
    const { setClear } = this.props;
    setClear(this.clearMessages);
  }

  componentDidUpdate() {
    const { error } = this.props;
    if (error !== '') {
      this.addNewErrorMessage();
    }
  }

  clearMessages() {
    this.setState({ errorMessages: [] });
  }

  addNewErrorMessage() {
    const { errorMessages, index } = this.state;
    const { error, handleError } = this.props;
    const newMessages = errorMessages;
    newMessages.push(
      <div
        key={index}
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <strong>
          Error:
          {' '}
          {error}
        </strong>
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          onClose={handleError('')}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>,
    );
    this.setState({ index: index + 1, errorMessages: newMessages });
  }

  render() {
    const { errorMessages } = this.state;
    return <center>{errorMessages}</center>;
  }
};

RetrieveError.propTypes = {
  error: PropTypes.string.isRequired,
  setClear: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired,
};
export default RetrieveError;
