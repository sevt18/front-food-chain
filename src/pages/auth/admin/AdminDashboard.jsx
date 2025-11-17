import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { adminService } from '../../../services/adminService';
import LoadingSpinner from '../../../components/auth/common/LoadingSpinner';
import UserManagement from '../../../components/auth/admin/UserManagement';
import ProductManagement from '../../../components/auth/admin/ProductManagement';
import AdminCharts from '../../../components/auth/admin/AdminCharts';
import AuditLogs from '../../../components/auth/admin/AuditLogs';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsResponse = await adminService.getStats();
      const statsData = statsResponse.data;

      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalProducts: statsData.totalProducts || 0,
        totalDistributors: statsData.totalDistributors || 0,
        totalVisitors: statsData.totalVisitors || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // En caso de error, establecer valores por defecto
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalDistributors: 0,
        totalVisitors: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <article className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </header>

      {stats && (
        <section className="stats-grid" aria-label="Estadísticas del sistema">
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">👥</span>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Usuarios Totales</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">📦</span>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Productos Totales</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">🚚</span>
            <div className="stat-info">
              <h3>{stats.totalDistributors}</h3>
              <p>Distribuidores</p>
            </div>
          </article>
          <article className="stat-card">
            <span className="stat-icon" aria-hidden="true">👤</span>
            <div className="stat-info">
              <h3>{stats.totalVisitors}</h3>
              <p>Visitantes</p>
            </div>
          </article>
        </section>
      )}

      <section className="admin-tabs">
        <nav className="tab-buttons" aria-label="Navegación de pestañas">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
            aria-selected={activeTab === 'users'}
            role="tab"
          >
            👥 Gestión de Usuarios
          </button>
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            aria-selected={activeTab === 'products'}
            role="tab"
          >
            📦 Gestión de Productos
          </button>
          <button
            className={`tab-button ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
            aria-selected={activeTab === 'charts'}
            role="tab"
          >
            📊 Gráficos y Reportes
          </button>
          <button
            className={`tab-button ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
            aria-selected={activeTab === 'audit'}
            role="tab"
          >
            📋 Historial de Auditoría
          </button>
        </nav>

        <section className="tab-content" role="tabpanel">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'charts' && <AdminCharts />}
          {activeTab === 'audit' && <AuditLogs />}
        </section>
      </section>
    </article>
  );
};

export default AdminDashboard;