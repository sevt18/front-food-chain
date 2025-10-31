import React from 'react';
import { Link } from 'react-router-dom';
import './SharedComponents.css';

const ProductCard = ({ product }) => {
  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    
    if (hasHalfStar) {
      stars.push('⭐');
    }
    
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  const getStatusBadge = (product) => {
    if (!product.isAvailable) {
      return { text: 'No Disponible', class: 'unavailable' };
    }
    // Aquí podrías agregar más lógica para bajo stock, etc.
    return { text: 'Disponible', class: 'available' };
  };

  const status = getStatusBadge(product);

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="product-avatar">
          {product.nombre?.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="product-content">
        <div className="product-header">
          <h3>{product.nombre}</h3>
          <span className={`status-badge ${status.class}`}>
            {status.text}
          </span>
        </div>
        
        <div className="product-details">
          <p className="product-type">{product.tipo}</p>
          <p className="product-code">Código: {product.codigoTrazabilidad}</p>
          <div className="product-rating">
            <span className="stars">{getRatingStars(product.rating)}</span>
            <span className="rating-value">({product.rating})</span>
          </div>
          <p className="production-date">
            Producido: {new Date(product.fechaProduccion).toLocaleDateString()}
          </p>
        </div>
        
        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;