import React, { Component } from "react";
import ProductInfoTable from "../../charts/ProductInfoTable";
import RetrieveButton from "../../design/RetrieveButton";

class ProductInfoTableWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      retrieve: false,
    };
    this.handleRetrieveButton = this.handleRetrieveButton.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  onLoaded() {
    this.setState({ retrieve: false });
  }

  componentDidMount() {
    this.props.setRetrieve(this.handleRetrieveButton);
  }

  handleRetrieveButton() {
    this.setState({ retrieve: true });
  }

  renderProductInfoTable() {
    return (
      <ProductInfoTable
        retrieve={this.state.retrieve}
        identifier={this.props.identifier}
        text={this.props.text}
        onLoaded={this.onLoaded}
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
        {this.renderProductInfoTable()}
      </div>
    );
  }
}

export default ProductInfoTableWrapper;
