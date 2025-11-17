import React from 'react';
import { useApi } from '../../../hooks/useApi';
import { recommendationService } from '../../../services/recommendationService';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductRecommendations.css';

const ProductRecommendations = ({ userId }) => {
  const { data, loading, error } = useApi(
    () => recommendationService.getRecommendations(),
    [userId]
  );

  // No mostrar nada si está cargando o hay error (silencioso)
  if (loading) {
    return null; // No mostrar spinner para no interrumpir la experiencia
  }

  // Si hay error o no hay recomendaciones, no mostrar nada
  if (error || !data?.recommendations || data.recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>✨ Productos Recomendados para Ti</h2>
        <p className="recommendations-subtitle">
          Basado en tus preferencias y reseñas
        </p>
      </div>
      <div className="recommendations-grid">
        {data.recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;

