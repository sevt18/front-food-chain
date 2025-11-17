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
    <article className="product-card">
      <figure className="product-image">
        <span className="product-avatar" aria-label={`Imagen de ${product.nombre}`}>
          {product.nombre?.charAt(0).toUpperCase()}
        </span>
      </figure>
      
      <section className="product-content">
        <header className="product-header">
          <h3>{product.nombre}</h3>
          <span className={`status-badge ${status.class}`}>
            {status.text}
          </span>
        </header>
        
        <dl className="product-details">
          <div>
            <dt className="sr-only">Tipo</dt>
            <dd className="product-type">{product.tipo}</dd>
          </div>
          <div>
            <dt className="sr-only">Código de trazabilidad</dt>
            <dd className="product-code">Código: {product.codigoTrazabilidad}</dd>
          </div>
          <div className="product-rating">
            <dt className="sr-only">Calificación</dt>
            <dd>
              <span className="stars" aria-label={`Calificación: ${product.rating} de 5 estrellas`}>
                {getRatingStars(product.rating)}
              </span>
              <span className="rating-value">({product.rating})</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Fecha de producción</dt>
            <dd className="production-date">
              Producido: <time dateTime={product.fechaProduccion}>
                {new Date(product.fechaProduccion).toLocaleDateString()}
              </time>
            </dd>
          </div>
        </dl>
        
        <nav className="product-actions" aria-label="Acciones del producto">
          <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm">
            Ver Detalles
          </Link>
        </nav>
      </section>
    </article>
  );
};

export default ProductCard;