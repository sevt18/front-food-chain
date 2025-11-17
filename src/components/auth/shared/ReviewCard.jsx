import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
  const isOwner = review.User?.id === currentUserId || review.usuarioId === currentUserId;
  const userName = review.User?.nombre || 'Usuario';
  const rating = review.puntuacion || 0;
  const comment = review.comentario || '';
  const createdAt = review.createdAt || review.created_at;

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? '⭐' : '☆');
    }
    return stars.join('');
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="reviewer-details">
            <span className="reviewer-name">{userName}</span>
            {createdAt && (
              <span className="review-date">
                {new Date(createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
        <div className="review-rating">
          <span className="stars">{getRatingStars(rating)}</span>
          <span className="rating-number">{rating}/5</span>
        </div>
      </div>

      {comment && (
        <div className="review-comment">
          <p>{comment}</p>
        </div>
      )}

      {isOwner && (
        <div className="review-actions">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => onEdit(review)}
          >
            Editar
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(review.id)}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;

