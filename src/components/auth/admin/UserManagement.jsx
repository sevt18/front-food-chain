import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import './AdminComponents.css';

const UserManagement = () => {
  const { data: users, loading, error, refetch } = useApi(adminService.getAllUsers);
  const { data: roles, loading: rolesLoading, error: rolesError } = useApi(adminService.getAllRoles);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Debug: mostrar roles en consola
  useEffect(() => {
    if (roles) {
      console.log('Roles cargados:', roles);
    }
    if (rolesError) {
      console.error('Error al cargar roles:', rolesError);
    }
  }, [roles, rolesError]);

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
    <section className="user-management">
      <header className="section-header">
        <h2>Gestión de Usuarios</h2>
        <p>Total: {users?.length || 0} usuarios registrados</p>
      </header>

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
                  {rolesLoading ? (
                    <span>Cargando roles...</span>
                  ) : rolesError ? (
                    <span className="error-text">Error al cargar roles</span>
                  ) : (
                    <select 
                      value={user.rolId || ''} 
                      onChange={(e) => handleAssignRole(user.id, parseInt(e.target.value))}
                      disabled={actionLoading || rolesLoading}
                      className="role-select"
                    >
                      <option value="">Seleccionar rol</option>
                      {roles && roles.length > 0 ? (
                        roles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.nombre.charAt(0).toUpperCase() + role.nombre.slice(1)}
                          </option>
                        ))
                      ) : (
                        <option disabled>No hay roles disponibles</option>
                      )}
                    </select>
                  )}
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
    </section>
  );
};

export default UserManagement;