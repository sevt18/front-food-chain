import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductList from '../../components/shared/ProductList';
import './VisitorDashboard.css';

const VisitorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="visitor-dashboard">
      <div className="dashboard-header">
        <h1>Explorar Productos</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>🎯 Sistema de Trazabilidad de Productos</h2>
            <p>
              Explora nuestra amplia gama de productos con trazabilidad completa 
              desde el origen hasta tu mesa. Cada producto cuenta con información 
              detallada sobre su producción, distribución y reseñas de otros usuarios.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <div className="feature-text">
                  <strong>Trazabilidad Completa</strong>
                  <span>Sigue el camino de cada producto</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <div className="feature-text">
                  <strong>Reseñas Verificadas</strong>
                  <span>Opiniones de usuarios reales</span>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div className="feature-text">
                  <strong>Información Detallada</strong>
                  <span>Datos completos de cada producto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products-section">
          <h2>Productos Disponibles</h2>
          <ProductList showFilters={true} />
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;