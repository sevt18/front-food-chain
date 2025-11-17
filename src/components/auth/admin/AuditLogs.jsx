import React, { useState } from 'react';
import { auditService } from '../../../services/auditService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import './AdminComponents.css';

const AuditLogs = () => {
  const [filters, setFilters] = useState({
    accion: '',
    usuarioId: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data: auditData, loading, error, refetch } = useApi(
    () => auditService.getLogs({ ...filters, limit, offset: page * limit }),
    [filters, page]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0); // Reset a primera página cuando cambian los filtros
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (loading) return <LoadingSpinner text="Cargando logs de auditoría..." />;
  if (error) return <div className="error-message">Error al cargar logs: {error.message}</div>;

  const logs = auditData?.logs || [];
  const total = auditData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="audit-logs">
      <div className="section-header">
        <h2>📋 Historial de Auditoría</h2>
        <div className="audit-stats">
          Total: {total} registros
        </div>
      </div>

      <div className="audit-filters">
        <div className="filter-group">
          <label>Acción:</label>
          <input
            type="text"
            name="accion"
            value={filters.accion}
            onChange={handleFilterChange}
            placeholder="Buscar por acción..."
          />
        </div>

        <div className="filter-group">
          <label>ID Usuario:</label>
          <input
            type="number"
            name="usuarioId"
            value={filters.usuarioId}
            onChange={handleFilterChange}
            placeholder="Filtrar por usuario..."
          />
        </div>

        <div className="filter-group">
          <label>Desde:</label>
          <input
            type="date"
            name="fechaDesde"
            value={filters.fechaDesde}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Hasta:</label>
          <input
            type="date"
            name="fechaHasta"
            value={filters.fechaHasta}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{formatDate(log.fechaHora)}</td>
                  <td>
                    {log.User ? (
                      <div className="user-info">
                        <span>{log.User.nombre}</span>
                        <small>{log.User.correo}</small>
                      </div>
                    ) : (
                      'Usuario eliminado'
                    )}
                  </td>
                  <td>
                    <span className="action-badge">{log.accion}</span>
                  </td>
                  <td>{log.descripcion || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            ← Anterior
          </button>
          
          <div className="pagination-info">
            Página {page + 1} de {totalPages}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={page >= totalPages - 1}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;

