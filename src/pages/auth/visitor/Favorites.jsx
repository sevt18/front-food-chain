import React, { useState, useEffect } from 'react';
import { productService } from '../../../services/productService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../../../components/auth/common/LoadingSpinner';
import ProductCard from '../../../components/auth/shared/ProductCard';
import './Favorites.css';

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { data: allProducts, loading } = useApi(productService.getProducts);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteIds(favorites);
  }, []);

  const favoriteProducts = allProducts?.filter(product => 
    favoriteIds.includes(product.id)
  ) || [];

  if (loading) return <LoadingSpinner text="Cargando favoritos..." />;

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Mis Favoritos</h1>
        <p>{favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}</p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="products-grid">
          {favoriteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <div className="empty-icon">❤️</div>
          <h3>No tienes favoritos aún</h3>
          <p>Explora productos y agrega tus favoritos para encontrarlos fácilmente</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;

