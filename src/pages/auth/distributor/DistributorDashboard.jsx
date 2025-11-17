import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { distributorService } from '../../../services/distributorService';
import { inventoryService } from '../../../services/inventoryService';
import LoadingSpinner from '../../../components/auth/common/LoadingSpinner';
import InventoryManager from '../../../components/auth/distributor/InventoryManager';
import BatchManager from '../../../components/auth/distributor/BatchManager';
import DistributorStats from '../../../components/auth/distributor/DistributorStats';
import './DistributorDashboard.css';

const DistributorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Intentar cargar estadísticas, pero no fallar si no existe
      let statsData = { totalProducts: 0, totalBatches: 0 };
      let inventory = [];

      try {
        const statsResponse = await distributorService.getStats();
        statsData = statsResponse.data || statsData;
      } catch (error) {
        // Solo loguear si no es un 404 esperado
        if (error.response?.status !== 404) {
          console.warn('Stats endpoint error:', error.message);
        }
      }

      try {
        const inventoryResponse = await inventoryService.getInventory();
        inventory = inventoryResponse.data || [];
      } catch (error) {
        // Solo loguear si no es un 404 esperado
        if (error.response?.status !== 404) {
          console.warn('Inventory endpoint error:', error.message);
        }
      }

      // Calcular estadísticas adicionales
      const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const lowStockCount = inventory.filter(item => (item.quantity || 0) < 10).length;

      setStats({
        ...statsData,
        totalStock,
        lowStockCount
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Establecer valores por defecto en caso de error
      setStats({
        totalProducts: 0,
        totalBatches: 0,
        totalStock: 0,
        lowStockCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <article className="distributor-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Distribuidor</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </header>

      {stats && (
        <section className="stats-grid" aria-label="Estadísticas del distribuidor">
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">📦</span>
            <div className="stat-info">
              <h3>{stats.totalProducts || 0}</h3>
              <p>Productos en Inventario</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">📋</span>
            <div className="stat-info">
              <h3>{stats.totalBatches || 0}</h3>
              <p>Lotes Activos</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">⚠️</span>
            <div className="stat-info">
              <h3>{stats.lowStockCount || 0}</h3>
              <p>Bajo Stock</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">📈</span>
            <div className="stat-info">
              <h3>{stats.totalStock || 0}</h3>
              <p>Total Unidades</p>
            </div>
          </article>
        </section>
      )}

      <section className="distributor-tabs">
        <nav className="tab-buttons" aria-label="Navegación de pestañas">
          <button
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
            aria-selected={activeTab === 'inventory'}
            role="tab"
          >
            📦 Gestión de Inventario
          </button>
          <button
            className={`tab-button ${activeTab === 'batches' ? 'active' : ''}`}
            onClick={() => setActiveTab('batches')}
            aria-selected={activeTab === 'batches'}
            role="tab"
          >
            📋 Gestión de Lotes
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            aria-selected={activeTab === 'stats'}
            role="tab"
          >
            📊 Estadísticas
          </button>
        </nav>

        <section className="tab-content" role="tabpanel">
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'batches' && <BatchManager />}
          {activeTab === 'stats' && <DistributorStats />}
        </section>
      </section>
    </article>
  );
};

export default DistributorDashboard;