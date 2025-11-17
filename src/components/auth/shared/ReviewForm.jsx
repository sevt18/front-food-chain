import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './ReviewForm.css';

const ReviewForm = ({ productId, review, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(review?.puntuacion || 0);
  const [comment, setComment] = useState(review?.comentario || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Por favor, selecciona una calificación');
      return;
    }

    if (!comment.trim()) {
      setError('Por favor, escribe un comentario');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        rating,
        comment: comment.trim()
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Error al guardar la reseña';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h3>{review ? 'Editar Reseña' : 'Escribir Reseña'}</h3>
        {user && (
          <span className="reviewer-name">por {user.nombre}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Calificación:</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                ⭐
              </button>
            ))}
            {rating > 0 && (
              <span className="rating-text">
                {rating === 1 ? 'Muy malo' : 
                 rating === 2 ? 'Malo' : 
                 rating === 3 ? 'Regular' : 
                 rating === 4 ? 'Bueno' : 'Excelente'}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comentario:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este producto..."
            rows="5"
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || rating === 0 || !comment.trim()}
          >
            {loading ? 'Guardando...' : (review ? 'Actualizar' : 'Publicar')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;

