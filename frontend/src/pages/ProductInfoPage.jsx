import React from 'react';
import PropTypes from 'prop-types';
import ProductInfo from '../components/input/ProductInfo';
import BlueprintPage from './BlueprintPage';

const ProductInfoPage = (props) => {
  const { extended } = props;
  return (
    <BlueprintPage
      content={
        <ProductInfo extended={extended} />
      }
    />
  );
};

ProductInfoPage.propTypes = { extended: PropTypes.bool.isRequired };
export default ProductInfoPage;
