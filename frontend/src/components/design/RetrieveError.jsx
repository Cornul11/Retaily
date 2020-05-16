import React, { Component } from 'react';
import PropTypes from 'prop-types';

const RetrieveError = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessages: [],
      index: 0,
    };
  }

  componentDidUpdate() {
    const { errorMessages, index } = this.state;
    const { error, handleError } = this.props;
    if (error === '') {
      return;
    }
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
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ index: index + 1, errorMessages: newMessages });
  }

  render() {
    const { errorMessages } = this.state;
    return <center>{errorMessages}</center>;
  }
};

RetrieveError.propTypes = { error: PropTypes.string.isRequired };
RetrieveError.propTypes = { handleError: PropTypes.func.isRequired };
export default RetrieveError;
