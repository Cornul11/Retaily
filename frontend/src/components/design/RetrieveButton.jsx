import React from 'react';
import PropTypes from 'prop-types';

const RetrieveButton = (props) => {
  const { retrieve, handleRetrieveButton } = props;
  return (
    <button
      type="button"
      className={`btn btn-secondary mt-2 mb-2 btn-block ${
        retrieve ? 'disabled' : ''
      }`}
      onClick={handleRetrieveButton}
    >
      {retrieve ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Bezig met laden...</span>
        </div>
      ) : (
        'Ophalen'
      )}
    </button>
  );
};

RetrieveButton.propTypes = {
  retrieve: PropTypes.bool.isRequired,
  handleRetrieveButton: PropTypes.func.isRequired,
};
export default RetrieveButton;
