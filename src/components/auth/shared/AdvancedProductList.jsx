import React, { useState, useEffect, useMemo } from 'react';
import { productService } from '../../../services/productService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductCard from './ProductCard';
import './SharedComponents.css';

const ITEMS_PER_PAGE = 12;

const AdvancedProductList = ({ showFilters = true, limit = null }) => {
  const { data: productsResponse, loading, error } = useApi(productService.getProducts);
  
  // Extraer productos de la respuesta paginada o usar directamente
  const products = productsResponse?.data || productsResponse || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [minRating, setMinRating] = useState(0);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueTypes = useMemo(() => {
    return [...new Set(products?.map(product => product.tipo) || [])];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(term) ||
        product.tipo.toLowerCase().includes(term) ||
        product.codigoTrazabilidad.toLowerCase().includes(term)
      );
    }

    // Filtro por tipo
    if (selectedType) {
      filtered = filtered.filter(product => product.tipo === selectedType);
    }

    // Filtro por rating mínimo
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Filtro por disponibilidad
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(product => product.isAvailable);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(product => !product.isAvailable);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nombre':
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
          break;
        case 'tipo':
          aValue = a.tipo.toLowerCase();
          bValue = b.tipo.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'fecha':
          aValue = new Date(a.fechaProduccion);
          bValue = new Date(b.fechaProduccion);
          break;
        default:
          aValue = a.nombre.toLowerCase();
          bValue = b.nombre.toLowerCase();
      }

      if (sortBy === 'rating' || sortBy === 'fecha') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    // Aplicar límite si se especifica
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [products, searchTerm, selectedType, sortBy, sortOrder, minRating, availabilityFilter, limit]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1); // Reset a la primera página cuando cambian los filtros
  }, [searchTerm, selectedType, sortBy, sortOrder, minRating, availabilityFilter]);

  if (loading) return <LoadingSpinner text="Cargando productos..." />;
  
  // Manejar errores de forma más suave
  if (error) {
    // Si es un error 404, mostrar mensaje informativo pero no romper la UI
    if (error?.response?.status === 404) {
      return (
        <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No se pudieron cargar los productos en este momento.</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Verifica que el backend esté corriendo.
          </p>
        </div>
      );
    }
    return (
      <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Error al cargar productos: {typeof error === 'string' ? error : 'Error desconocido'}</p>
      </div>
    );
  }
  
  // Si no hay productos, mostrar mensaje
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>No hay productos disponibles.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {showFilters && (
        <div className="product-filters advanced-filters">
          <div className="filters-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, tipo o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Tipo:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Todos</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Rating Mínimo:</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>Todos</option>
                <option value={1}>1+ ⭐</option>
                <option value={2}>2+ ⭐</option>
                <option value={3}>3+ ⭐</option>
                <option value={4}>4+ ⭐</option>
                <option value={5}>5 ⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Disponibilidad:</label>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="available">Disponibles</option>
                <option value="unavailable">No Disponibles</option>
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="nombre">Nombre</option>
                <option value="tipo">Tipo</option>
                <option value="rating">Rating</option>
                <option value="fecha">Fecha de Producción</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Orden:</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>

            <div className="results-count">
              {filteredAndSortedProducts.length} producto(s) encontrado(s)
            </div>
          </div>
        </div>
      )}

      <div className="products-grid">
        {paginatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {!limit && totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          
          <div className="pagination-info">
            Página {currentPage} de {totalPages}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedProductList;

