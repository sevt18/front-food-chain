import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { reviewService } from '../../../services/reviewService';
import { useApi } from '../../../hooks/useApi';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/auth/common/LoadingSpinner';
import ReviewsSection from '../../../components/auth/shared/ReviewsSection';
import TraceabilityTimeline from '../../../components/auth/shared/TraceabilityTimeline';
import FavoriteButton from '../../../components/auth/shared/FavoriteButton';
import ProductImages from '../../../components/auth/shared/ProductImages';
import ProductQR from '../../../components/auth/shared/ProductQR';
import RelatedProducts from '../../../components/auth/shared/RelatedProducts';
import ProductTags from '../../../components/auth/shared/ProductTags';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, loading, error, refetch } = useApi(() => productService.getProduct(id), [id]);
  const { data: reviews, loading: reviewsLoading, refetch: refetchReviews } = useApi(
    () => reviewService.getReviews(id),
    [id]
  );

  useEffect(() => {
    // Verificar si el producto está en favoritos
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
  }, [id]);

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

  if (loading) return <LoadingSpinner text="Cargando producto..." />;
  if (error) {
    return (
      <article className="product-detail-error">
        <section className="error-content">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/products" className="btn btn-primary">
            Volver a Productos
          </Link>
        </section>
      </article>
    );
  }

  if (!product) return null;

  return (
    <article className="product-detail">
      <header className="product-detail-header">
        <nav>
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
            ← Volver
          </button>
        </nav>
        <FavoriteButton 
          productId={product.id} 
          isFavorite={isFavorite}
          onToggle={(fav) => setIsFavorite(fav)}
        />
      </header>

      <section className="product-detail-content">
        <section className="product-main-info">
          <figure className="product-image-large">
            <span className="product-avatar-large" aria-label={`Imagen de ${product.nombre}`}>
              {product.nombre?.charAt(0).toUpperCase()}
            </span>
          </figure>

          <section className="product-info">
            <header className="product-title-section">
              <h1>{product.nombre}</h1>
              <span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                {product.isAvailable ? 'Disponible' : 'No Disponible'}
              </span>
            </header>

            <section className="product-rating-section" aria-label="Calificación del producto">
              <div className="rating-display">
                <span className="stars-large" aria-label={`Calificación: ${product.rating || 0} de 5 estrellas`}>
                  {getRatingStars(product.rating || 0)}
                </span>
                <span className="rating-value-large">({product.rating || 0})</span>
                {reviews && (
                  <span className="reviews-count">
                    {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                  </span>
                )}
              </div>
            </section>

            <dl className="product-details-grid">
              <div className="detail-item">
                <dt className="detail-label">Tipo:</dt>
                <dd className="detail-value">{product.tipo}</dd>
              </div>
              <div className="detail-item">
                <dt className="detail-label">Código de Trazabilidad:</dt>
                <dd className="detail-value code">{product.codigoTrazabilidad}</dd>
              </div>
              <div className="detail-item">
                <dt className="detail-label">Fecha de Producción:</dt>
                <dd className="detail-value">
                  <time dateTime={product.fechaProduccion}>
                    {new Date(product.fechaProduccion).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </dd>
              </div>
            </dl>

            <nav className="product-actions" aria-label="Acciones del producto">
              <ProductQR 
                productId={product.id}
                productName={product.nombre}
                codigoTrazabilidad={product.codigoTrazabilidad}
              />
            </nav>
          </section>
        </section>

        <section className="product-sections">
          <ProductImages 
            productId={product.id} 
            canEdit={user?.role === 'admin' || user?.role?.nombre === 'admin'}
          />

          <ProductTags 
            productId={product.id}
            tags={product.Tags || product.tags || []}
          />
          
          <TraceabilityTimeline productId={product.id} stages={product.Stages || product.stages || []} />
          
          <ReviewsSection 
            productId={product.id}
            reviews={reviews || product.Reviews || product.reviews || []}
            loading={reviewsLoading}
            onReviewAdded={refetchReviews}
            onReviewUpdated={refetchReviews}
            onReviewDeleted={refetchReviews}
          />

          <RelatedProducts productId={product.id} />
        </section>
      </section>
    </article>
  );
};

export default ProductDetail;

