import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/design/NavBar';

const BluePrintPage = (props) => {
  const { content } = props;
  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="card border-0 shadow my-md-4 my-3">
          <div className="card-body p-xs-0 p-md-5">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

BluePrintPage.propTypes = { content: PropTypes.element.isRequired };
export default BluePrintPage;
