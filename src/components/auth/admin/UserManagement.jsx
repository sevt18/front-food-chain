import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import './AdminComponents.css';

const UserManagement = () => {
  const { data: users, loading, error, refetch } = useApi(adminService.getAllUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAssignRole = async (userId, newRoleId) => {
    setActionLoading(true);
    try {
      await adminService.assignRole({ userId, roleId: newRoleId });
      await refetch();
    } catch (error) {
      console.error('Error assigning role:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner text="Cargando usuarios..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Total: {users?.length || 0} usuarios registrados</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-info">
                    <div className="user-avatar-sm">
                      {user.nombre?.charAt(0).toUpperCase()}
                    </div>
                    {user.nombre}
                  </div>
                </td>
                <td>{user.correo}</td>
                <td>
                  <select 
                    value={user.rolId} 
                    onChange={(e) => handleAssignRole(user.id, e.target.value)}
                    disabled={actionLoading}
                    className="role-select"
                  >
                    <option value="1">Visitante</option>
                    <option value="2">Distribuidor</option>
                    <option value="3">Administrador</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewUser(user)}
                    >
                      Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Detalles del Usuario"
      >
        {selectedUser && (
          <div className="user-details">
            <div className="detail-row">
              <label>Nombre:</label>
              <span>{selectedUser.nombre}</span>
            </div>
            <div className="detail-row">
              <label>Correo:</label>
              <span>{selectedUser.correo}</span>
            </div>
            <div className="detail-row">
              <label>Rol:</label>
              <span>{selectedUser.role?.nombre}</span>
            </div>
            <div className="detail-row">
              <label>Fecha de Registro:</label>
              <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;