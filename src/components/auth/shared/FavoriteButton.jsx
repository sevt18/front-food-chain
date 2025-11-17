import React, { useState, useEffect } from 'react';
import './FavoriteButton.css';

const FavoriteButton = ({ productId, isFavorite: initialFavorite, onToggle }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleToggle = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    if (onToggle) {
      onToggle(!isFavorite);
    }
  };

  return (
    <button
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      onClick={handleToggle}
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite ? '❤️' : '🤍'}
      <span>{isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}</span>
    </button>
  );
};

export default FavoriteButton;

