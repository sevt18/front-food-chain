import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { recommendationService } from '../../../services/recommendationService';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductRecommendations.css';

const RelatedProducts = ({ productId }) => {
  const { data, loading, error } = useApi(
    () => recommendationService.getRelatedProducts(productId),
    [productId]
  );

  // No mostrar nada si está cargando o hay error (silencioso)
  if (loading) {
    return null;
  }

  // Si hay error o no hay productos relacionados, no mostrar nada
  if (error || !data?.related || data.related.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>🔗 Productos Relacionados</h2>
        <p className="recommendations-subtitle">
          Otros productos similares que podrían interesarte
        </p>
      </div>
      <div className="recommendations-grid">
        {data.related.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

