import React, { Component } from 'react';
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
    this.props.setRetrieve(this.handleRetrieveButton);
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
    return (
      <ProductInfoTable
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        onLoaded={this.onLoaded}
        onError={this.handleError}
        extended={this.props.extended}
      />
    );
  }

  render() {
    return (
      <div>
        <RetrieveButton
          handleRetrieveButton={this.handleRetrieveButton}
          retrieve={this.state.retrieve}
        />
        <RetrieveError
          error={this.state.error}
          handleError={this.handleError}
        />
        {this.renderProductInfoTable()}
      </div>
    );
  }
}

export default ProductInfoTableWrapper;
