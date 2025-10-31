import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UserManagement from '../../components/admin/UserManagement';
import ProductManagement from '../../components/admin/ProductManagement';
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
      // En un caso real, tendrías un endpoint específico para stats
      const [usersResponse, productsResponse] = await Promise.all([
        adminService.getAllUsers(),
        productService.getProducts()
      ]);

      const users = usersResponse.data;
      const products = productsResponse.data;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        activeUsers: users.filter(u => u.activo).length,
        availableProducts: products.filter(p => p.isAvailable).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Cargando dashboard..." />;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Usuarios Totales</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Productos Totales</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.activeUsers}</h3>
              <p>Usuarios Activos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <h3>{stats.availableProducts}</h3>
              <p>Productos Disponibles</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Gestión de Usuarios
          </button>
          <button
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Gestión de Productos
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'products' && <ProductManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;