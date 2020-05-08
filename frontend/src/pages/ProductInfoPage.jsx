import React, { Component } from 'react';
import ProductInfo from '../components/input/ProductInfo';
import BlueprintPage from './BlueprintPage';

class ProductInfoPage extends Component {
  render() {
    return (
      <BlueprintPage 
        content = {
          <ProductInfo extended={this.props.extended} />
        }
      />
    );
  }
}
export default ProductInfoPage;
