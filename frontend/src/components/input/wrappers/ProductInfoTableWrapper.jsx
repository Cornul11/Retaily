import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductInfoTable from '../../charts/ProductInfoTable';
import RetrieveButton from '../../design/RetrieveButton';
import RetrieveError from '../../design/RetrieveError';

class ProductInfoTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retrieve: false,
      error: '',
    };
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { setRetrieve } = this.props;
    setRetrieve(this.handleRetrieveButton);
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }


  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  handleError(error) {
    this.setState({ error });
  }

  renderProductInfoTable() {
    const { retrieve } = this.state;
    const { identifier, text, extended } = this.props;
    return (
      <ProductInfoTable
        retrieve={retrieve}
        identifier={identifier}
        text={text}
        onLoaded={this.onLoaded}
        onError={this.handleError}
        extended={extended}
      />
    );
  }

  render() {
    const { retrieve, error } = this.state;
    return (
      <div>
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={retrieve}
        />
        <RetrieveError
          error={error}
          handleError={this.handleError}
        />
        {this.renderProductInfoTable()}
      </div>
    );
  }
}

ProductInfoTableWrapper.propTypes = { identifier: PropTypes.string.isRequired };
ProductInfoTableWrapper.propTypes = { extended: PropTypes.bool.isRequired };
ProductInfoTableWrapper.propTypes = { text: PropTypes.string.isRequired };
ProductInfoTableWrapper.propTypes = { setRetrieve: PropTypes.func.isRequired };

export default ProductInfoTableWrapper;
