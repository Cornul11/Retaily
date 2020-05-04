import React, { Component } from 'react';
import ProductInfo from '../components/input/ProductInfo';
import NavBar from '../components/design/NavBar';

class ProductInfoPage extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="card border-0 shadow my-5">
            <div className="card-body p-5">
              {/* ----- put page content under this line -----*/}
              <ProductInfo extended={this.props.extended} />
              {/* ----- page content end -----*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ProductInfoPage;
