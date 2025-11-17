import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import ProductList from '../../../components/auth/shared/ProductList';
import ProductRecommendations from '../../../components/auth/shared/ProductRecommendations';
import Favorites from './Favorites';
import './VisitorDashboard.css';

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  return (
    <article className="visitor-dashboard">
      <header className="dashboard-header">
        <h1>Explorar Productos</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </header>

      <nav className="visitor-tabs" aria-label="Navegación de pestañas">
        <button
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
          aria-selected={activeTab === 'products'}
          role="tab"
        >
          📦 Todos los Productos
        </button>
        <button
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
          aria-selected={activeTab === 'favorites'}
          role="tab"
        >
          ❤️ Mis Favoritos
        </button>
      </nav>

      <section className="dashboard-content" role="tabpanel">
        {activeTab === 'products' && (
          <>
            <section className="welcome-section">
              <article className="welcome-card">
                <h2>🎯 FOODCHAIN - Sistema de Productos</h2>
                <p>
                  Explora nuestra amplia gama de productos con trazabilidad completa 
                  desde el origen hasta tu mesa. Cada producto cuenta con información 
                  detallada sobre su producción, distribución y reseñas de otros usuarios.
                </p>
                <ul className="features-grid" role="list">
                  <li className="feature-item">
                    <span className="feature-icon" aria-hidden="true">🔍</span>
                    <div className="feature-text">
                      <strong>Trazabilidad Completa</strong>
                      <span>Sigue el camino de cada producto</span>
                    </div>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon" aria-hidden="true">⭐</span>
                    <div className="feature-text">
                      <strong>Reseñas Verificadas</strong>
                      <span>Opiniones de usuarios reales</span>
                    </div>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon" aria-hidden="true">📊</span>
                    <div className="feature-text">
                      <strong>Información Detallada</strong>
                      <span>Datos completos de cada producto</span>
                    </div>
                  </li>
                </ul>
              </article>
            </section>
            {user?.id && <ProductRecommendations userId={user.id} />}
            <section className="products-section" aria-label="Lista de productos">
              <ProductList showFilters={true} />
            </section>
          </>
        )}
        {activeTab === 'favorites' && <Favorites />}
      </section>
    </article>
  );
};

export default VisitorDashboard;