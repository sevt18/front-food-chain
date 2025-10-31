import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { distributorService } from '../../services/distributorService';
import { inventoryService } from '../../services/inventoryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import InventoryManager from '../../components/distributor/InventoryManager';
import BatchManager from '../../components/distributor/BatchManager';
import DistributorStats from '../../components/distributor/DistributorStats';
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
      const [statsResponse, inventoryResponse] = await Promise.all([
        distributorService.getStats(),
        inventoryService.getInventory()
      ]);

      const statsData = statsResponse.data;
      const inventory = inventoryResponse.data;

      // Calcular estadísticas adicionales
      const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
      const lowStockCount = inventory.filter(item => item.quantity < 10).length;

      setStats({
        ...statsData,
        totalStock,
        lowStockCount
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <div className="distributor-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Distribuidor</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts || 0}</h3>
              <p>Productos en Inventario</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{stats.totalBatches || 0}</h3>
              <p>Lotes Activos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{stats.lowStockCount || 0}</h3>
              <p>Bajo Stock</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h3>{stats.totalStock || 0}</h3>
              <p>Total Unidades</p>
            </div>
          </div>
        </div>
      )}

      <div className="distributor-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📦 Gestión de Inventario
          </button>
          <button
            className={`tab-button ${activeTab === 'batches' ? 'active' : ''}`}
            onClick={() => setActiveTab('batches')}
          >
            📋 Gestión de Lotes
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Estadísticas
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'batches' && <BatchManager />}
          {activeTab === 'stats' && <DistributorStats />}
        </div>
      </div>
    </div>
  );
};

export default DistributorDashboard;