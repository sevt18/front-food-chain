import React from 'react';
import ProductList from '../../components/shared/ProductList';

const Products = () => {
  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Catálogo de Productos</h1>
        <p>Explora todos nuestros productos disponibles</p>
      </div>
      <ProductList showFilters={true} />
    </div>
  );
};

export default Products;