import React from 'react';
import { distributorService } from '../../../services/distributorService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import './DistributorComponents.css';

const DistributorStats = () => {
  const { data: stats, loading, error } = useApi(distributorService.getStats);

  if (loading) return <LoadingSpinner text="Cargando estadísticas..." />;
  if (error) {
    // Si es un error 404, mostrar mensaje más amigable
    if (error.response?.status === 404 || (typeof error === 'string' && error.includes('404'))) {
      return (
        <div className="info-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>⚠️ El endpoint de estadísticas aún no está disponible en el backend.</p>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Esta funcionalidad estará disponible cuando el backend implemente la ruta <code>/api/distributor/stats</code>
          </p>
        </div>
      );
    }
    return <div className="error-message">Error al cargar estadísticas: {typeof error === 'string' ? error : error.message}</div>;
  }

  return (
    <div className="distributor-stats">
      <div className="section-header">
        <h2>Estadísticas del Distribuidor</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card large">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Total de Productos en Inventario</p>
          </div>
        </div>

        <div className="stat-card large">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats?.totalBatches || 0}</h3>
            <p>Lotes Activos</p>
          </div>
        </div>

        <div className="stat-card large">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats?.lowStockItems?.length || 0}</h3>
            <p>Productos con Bajo Stock</p>
          </div>
        </div>

        <div className="stat-card large">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{stats?.inventoryStats?.length || 0}</h3>
            <p>Items Únicos en Stock</p>
          </div>
        </div>
      </div>

      {stats?.lowStockItems && stats.lowStockItems.length > 0 && (
        <div className="alert-section">
          <div className="alert alert-warning">
            <h4>⚠️ Productos con Bajo Stock</h4>
            <div className="low-stock-list">
              {stats.lowStockItems.map(item => (
                <div key={item.id} className="low-stock-item">
                  <span className="product-name">{item.Product?.nombre}</span>
                  <span className="stock-quantity">{item.quantity} unidades</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="inventory-breakdown">
        <h3>Desglose de Inventario</h3>
        <div className="breakdown-grid">
          {stats?.inventoryStats?.map(item => (
            <div key={item.id} className="breakdown-item">
              <div className="breakdown-product">
                <div className="product-avatar-sm">
                  {item.Product?.nombre?.charAt(0).toUpperCase()}
                </div>
                <span>{item.Product?.nombre}</span>
              </div>
              <div className="breakdown-quantity">
                <span className={`quantity-badge ${item.quantity < 10 ? 'low' : 'normal'}`}>
                  {item.quantity} unidades
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributorStats;