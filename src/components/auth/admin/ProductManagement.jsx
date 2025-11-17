import React, { useState } from 'react';
import { productService } from '../../../services/productService';
import { useApi } from '../../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { PRODUCT_TYPES } from '../../../utils/constants';
import { validateProduct } from '../../../utils/validators';
import { exportProductsToPDF, exportProductsToExcel } from '../../../utils/export';
import { notify } from '../../../utils/notifications';
import './AdminComponents.css';

const ProductManagement = () => {
  const { data: productsResponse, loading, error, refetch } = useApi(productService.getProducts);
  
  // Normalizar productos: puede venir como array directo, objeto con data, o objeto paginado
  const products = Array.isArray(productsResponse) 
    ? productsResponse 
    : productsResponse?.data || productsResponse?.products || [];
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
    // Generar código de trazabilidad único automáticamente
    const uniqueCode = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setFormData({
      nombre: '',
      tipo: '',
      fechaProduccion: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
      codigoTrazabilidad: uniqueCode
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
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }

    setActionLoading(true);
    try {
      await productService.deleteProduct(productId);
      await refetch();
      notify.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      notify.error('Error al eliminar el producto');
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
      notify.success(editingProduct ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Error al guardar el producto';
      
      if (errorMessage.includes('unique') || errorMessage.includes('duplicate')) {
        notify.error('El código de trazabilidad ya existe. Por favor, usa un código diferente.');
      } else {
        notify.error(errorMessage);
      }
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
  
  // Manejar errores de forma más suave
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'Error al cargar productos';
    return (
      <div className="error-message" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>{errorMessage}</p>
      </div>
    );
  }
  
  // Asegurar que products sea siempre un array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="product-management">
      <header className="section-header">
        <h2>Gestión de Productos</h2>
        <nav className="header-actions" aria-label="Acciones de gestión">
          {products && products.length > 0 && (
            <>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  try {
                    exportProductsToPDF(safeProducts);
                    notify.success('Productos exportados a PDF');
                  } catch (error) {
                    notify.error('Error al exportar a PDF');
                  }
                }}
              >
                📄 Exportar PDF
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  exportProductsToExcel(safeProducts);
                  notify.success('Productos exportados a Excel');
                }}
              >
                📊 Exportar Excel
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={handleCreate}>
            + Nuevo Producto
          </button>
        </nav>
      </header>

      {!safeProducts || safeProducts.length === 0 ? (
        <article className="empty-state">
          <span className="empty-icon" aria-hidden="true">📦</span>
          <h3>No hay productos registrados</h3>
          <p>Comienza agregando tu primer producto al sistema</p>
          <button className="btn btn-primary" onClick={handleCreate}>
            + Crear Primer Producto
          </button>
        </article>
      ) : (
        <ul className="products-grid" role="list">
          {safeProducts.map(product => (
            <li key={product.id}>
              <article className="product-card">
                <header className="product-header">
                  <h3>{product.nombre}</h3>
                  <span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                    {product.isAvailable ? 'Disponible' : 'No Disponible'}
                  </span>
                </header>
                <dl className="product-details">
                  <div>
                    <dt>Tipo:</dt>
                    <dd>{product.tipo}</dd>
                  </div>
                  <div>
                    <dt>Código:</dt>
                    <dd>{product.codigoTrazabilidad}</dd>
                  </div>
                  <div>
                    <dt>Rating:</dt>
                    <dd>{product.rating} ⭐</dd>
                  </div>
                  <div>
                    <dt>Producción:</dt>
                    <dd>
                      <time dateTime={product.fechaProduccion}>
                        {new Date(product.fechaProduccion).toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                </dl>
                <nav className="product-actions" aria-label="Acciones del producto">
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
                </nav>
              </article>
            </li>
          ))}
        </ul>
      )}

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
              placeholder="Ej: PROD-001-2024 (debe ser único)"
              required
            />
            {formErrors.codigoTrazabilidad && <span className="error-text">{formErrors.codigoTrazabilidad}</span>}
            <small className="form-hint">
              El código debe ser único. Se genera automáticamente, pero puedes modificarlo.
            </small>
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
    </section>
  );
};

export default ProductManagement;