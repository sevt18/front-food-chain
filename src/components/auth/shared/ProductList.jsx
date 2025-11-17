import React from 'react';
import AdvancedProductList from './AdvancedProductList';

const ProductList = ({ showFilters = true, limit = null }) => {
  return <AdvancedProductList showFilters={showFilters} limit={limit} />;
};

export default ProductList;