import React, { useState } from 'react';
import { productService } from '../../services/productService';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { PRODUCT_TYPES } from '../../utils/constants';
import { validateProduct } from '../../utils/validators';
import './AdminComponents.css';

const ProductManagement = () => {
  const { data: products, loading, error, refetch } = useApi(productService.getProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    fechaProduccion: '',
    codigoTrazabilidad: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      tipo: '',
      fechaProduccion: '',
      codigoTrazabilidad: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre,
      tipo: product.tipo,
      fechaProduccion: product.fechaProduccion.split('T')[0],
      codigoTrazabilidad: product.codigoTrazabilidad
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    setActionLoading(true);
    try {
      await productService.deleteProduct(productId);
      await refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateProduct(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setActionLoading(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      
      await refetch();
      setShowModal(false);
      setFormErrors({});
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto');
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
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) return <LoadingSpinner text="Cargando productos..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Nuevo Producto
        </button>
      </div>

      <div className="products-grid">
        {products?.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.nombre}</h3>
              <span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                {product.isAvailable ? 'Disponible' : 'No Disponible'}
              </span>
            </div>
            <div className="product-details">
              <p><strong>Tipo:</strong> {product.tipo}</p>
              <p><strong>Código:</strong> {product.codigoTrazabilidad}</p>
              <p><strong>Rating:</strong> {product.rating} ⭐</p>
              <p><strong>Producción:</strong> {new Date(product.fechaProduccion).toLocaleDateString()}</p>
            </div>
            <div className="product-actions">
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => handleEdit(product)}
              >
                Editar
              </button>
              <button 
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(product.id)}
                disabled={actionLoading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? 'Editar Producto' : 'Crear Producto'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            {formErrors.nombre && <span className="error-text">{formErrors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo:</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo</option>
              {PRODUCT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {formErrors.tipo && <span className="error-text">{formErrors.tipo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fechaProduccion">Fecha de Producción:</label>
            <input
              type="date"
              id="fechaProduccion"
              name="fechaProduccion"
              value={formData.fechaProduccion}
              onChange={handleChange}
              required
            />
            {formErrors.fechaProduccion && <span className="error-text">{formErrors.fechaProduccion}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="codigoTrazabilidad">Código de Trazabilidad:</label>
            <input
              type="text"
              id="codigoTrazabilidad"
              name="codigoTrazabilidad"
              value={formData.codigoTrazabilidad}
              onChange={handleChange}
              placeholder="Ej: PROD-001-2024"
              required
            />
            {formErrors.codigoTrazabilidad && <span className="error-text">{formErrors.codigoTrazabilidad}</span>}
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
              {actionLoading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;