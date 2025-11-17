import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { reviewService } from '../../../services/reviewService';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './ReviewsSection.css';

const ReviewsSection = ({ 
  productId, 
  reviews, 
  loading, 
  onReviewAdded, 
  onReviewUpdated, 
  onReviewDeleted 
}) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Verificar si el usuario ya tiene una reseña
  const userReview = reviews?.find(review => 
    review.User?.id === user?.id || review.usuarioId === user?.id
  );

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview.id, reviewData);
        if (onReviewUpdated) onReviewUpdated();
      } else {
        await reviewService.createReview(productId, reviewData);
        if (onReviewAdded) onReviewAdded();
      }
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (error) {
      console.error('Error al guardar reseña:', error);
      throw error;
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      if (onReviewDeleted) onReviewDeleted();
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
      alert('Error al eliminar la reseña');
    }
  };

  return (
    <section className="reviews-section" aria-label="Reseñas y calificaciones">
      <header className="reviews-header">
        <h2>Reseñas y Calificaciones</h2>
        {user && !userReview && !showReviewForm && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowReviewForm(true)}
          >
            + Escribir Reseña
          </button>
        )}
      </header>

      {user && showReviewForm && (
        <ReviewForm
          productId={productId}
          review={editingReview}
          onSubmit={handleReviewSubmit}
          onCancel={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
        />
      )}

      {loading ? (
        <LoadingSpinner text="Cargando reseñas..." />
      ) : reviews && reviews.length > 0 ? (
        <ul className="reviews-list" role="list">
          {reviews.map(review => (
            <li key={review.id}>
              <ReviewCard
                review={review}
                currentUserId={user?.id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            </li>
          ))}
        </ul>
      ) : (
        <article className="empty-reviews">
          <span className="empty-icon" aria-hidden="true">💬</span>
          <h3>No hay reseñas aún</h3>
          <p>Sé el primero en dejar una reseña sobre este producto</p>
        </article>
      )}
    </section>
  );
};

export default ReviewsSection;

