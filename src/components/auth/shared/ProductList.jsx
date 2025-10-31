import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductCard from './ProductCard';
import './SharedComponents.css';

const ProductList = ({ showFilters = true, limit = null }) => {
  const { data: products, loading, error } = useApi(productService.getProducts);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (products) {
      let filtered = products;

      // Aplicar filtro de búsqueda
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.codigoTrazabilidad.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Aplicar filtro por tipo
      if (selectedType) {
        filtered = filtered.filter(product => product.tipo === selectedType);
      }

      // Aplicar límite si se especifica
      if (limit) {
        filtered = filtered.slice(0, limit);
      }

      setFilteredProducts(filtered);
    }
  }, [products, searchTerm, selectedType, limit]);

  const uniqueTypes = [...new Set(products?.map(product => product.tipo) || [])];

  if (loading) return <LoadingSpinner text="Cargando productos..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-list">
      {showFilters && (
        <div className="product-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-select">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;