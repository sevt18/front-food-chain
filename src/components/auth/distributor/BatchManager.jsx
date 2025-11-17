import React, { useState } from 'react';
import { batchService } from '../../../services/batchService';
import { productService } from '../../../services/productService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import './DistributorComponents.css';

const BatchManager = () => {
  const { data: batches, loading, error, refetch } = useApi(batchService.getBatches);
  const { data: productsResponse } = useApi(productService.getProducts);
  
  // Normalizar productos: puede venir como array directo, objeto con data, o objeto paginado
  const products = Array.isArray(productsResponse) 
    ? productsResponse 
    : productsResponse?.data || productsResponse?.products || [];
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    loteCodigo: '',
    productoId: '',
    quantity: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreate = () => {
    setEditingBatch(null);
    setFormData({
      loteCodigo: '',
      productoId: '',
      quantity: ''
    });
    setShowModal(true);
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      loteCodigo: batch.loteCodigo,
      productoId: batch.productoId,
      quantity: batch.quantity.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (batchId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este lote?')) {
      return;
    }

    setActionLoading(true);
    try {
      await batchService.manageBatches({
        action: 'delete',
        batchId: batchId
      });
      await refetch();
    } catch (error) {
      console.error('Error deleting batch:', error);
      alert('Error al eliminar el lote');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.loteCodigo || !formData.productoId || !formData.quantity) {
      alert('Por favor completa todos los campos');
      return;
    }

    setActionLoading(true);
    try {
      const batchData = {
        loteCodigo: formData.loteCodigo,
        productoId: formData.productoId,
        quantity: parseInt(formData.quantity)
      };

      if (editingBatch) {
        await batchService.manageBatches({
          action: 'update',
          batchId: editingBatch.id,
          batchData: batchData
        });
      } else {
        await batchService.manageBatches({
          action: 'create',
          batchData: batchData
        });
      }
      
      await refetch();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Error al guardar el lote');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <LoadingSpinner text="Cargando lotes..." />;
  if (error) {
    // Si es un error 404, mostrar mensaje más amigable
    if (error.response?.status === 404 || (typeof error === 'string' && error.includes('404'))) {
      return (
        <div className="info-message" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>⚠️ El endpoint de lotes aún no está disponible en el backend.</p>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Esta funcionalidad estará disponible cuando el backend implemente la ruta <code>/api/distributor/batches</code>
          </p>
        </div>
      );
    }
    return <div className="error-message">Error al cargar lotes: {typeof error === 'string' ? error : error.message}</div>;
  }

  return (
    <div className="batch-manager">
      <div className="section-header">
        <h2>Gestión de Lotes</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Nuevo Lote
        </button>
      </div>

      <div className="batches-grid">
        {batches?.map(batch => (
          <div key={batch.id} className="batch-card">
            <div className="batch-header">
              <h3>Lote: {batch.loteCodigo}</h3>
              <span className="batch-quantity">{batch.quantity} unidades</span>
            </div>
            <div className="batch-details">
              <p><strong>Producto:</strong> {batch.Product?.nombre}</p>
              <p><strong>Código:</strong> {batch.Product?.codigoTrazabilidad}</p>
              <p><strong>Creado:</strong> {new Date(batch.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="batch-actions">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => handleEdit(batch)}
              >
                Editar
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(batch.id)}
                disabled={actionLoading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {batches?.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No hay lotes registrados</h3>
          <p>Comienza creando tu primer lote de productos</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            Crear Primer Lote
          </button>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingBatch ? 'Editar Lote' : 'Crear Nuevo Lote'}
      >
        <form onSubmit={handleSubmit} className="batch-form">
          <div className="form-group">
            <label htmlFor="loteCodigo">Código del Lote:</label>
            <input
              type="text"
              id="loteCodigo"
              name="loteCodigo"
              value={formData.loteCodigo}
              onChange={handleChange}
              placeholder="Ej: LOTE-001-2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="productoId">Producto:</label>
            <select
              id="productoId"
              name="productoId"
              value={formData.productoId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar producto</option>
              {Array.isArray(products) && products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.nombre} - {product.codigoTrazabilidad}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={actionLoading}
            >
              {actionLoading ? 'Guardando...' : (editingBatch ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BatchManager;