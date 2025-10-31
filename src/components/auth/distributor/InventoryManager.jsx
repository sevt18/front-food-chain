import React, { useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import { productService } from '../../services/productService';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import './DistributorComponents.css';

const InventoryManager = () => {
  const { data: inventory, loading, error, refetch } = useApi(inventoryService.getInventory);
  const { data: products } = useApi(productService.getProducts);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [actionType, setActionType] = useState('add');
  const [actionLoading, setActionLoading] = useState(false);

  const handleInventoryAction = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !quantity || quantity <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    setActionLoading(true);
    try {
      await inventoryService.manageInventory({
        action: actionType,
        productId: selectedProduct,
        quantity: parseInt(quantity)
      });
      
      await refetch();
      setShowModal(false);
      setSelectedProduct('');
      setQuantity('');
    } catch (error) {
      console.error('Error managing inventory:', error);
      alert(error.response?.data?.message || 'Error al gestionar inventario');
    } finally {
      setActionLoading(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusText = (quantity) => {
    if (quantity === 0) return 'Agotado';
    if (quantity < 10) return 'Bajo Stock';
    return 'En Stock';
  };

  if (loading) return <LoadingSpinner text="Cargando inventario..." />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="inventory-manager">
      <div className="section-header">
        <h2>Gestión de Inventario</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Gestionar Stock
        </button>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{inventory?.length || 0}</h3>
            <p>Productos en Inventario</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{inventory?.filter(item => item.quantity < 10).length || 0}</h3>
            <p>Productos con Bajo Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>{inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0}</h3>
            <p>Total de Unidades</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Código</th>
              <th>Stock Actual</th>
              <th>Estado</th>
              <th>Última Actualización</th>
            </tr>
          </thead>
          <tbody>
            {inventory?.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="product-info">
                    <div className="product-avatar">
                      {item.Product?.nombre?.charAt(0).toUpperCase()}
                    </div>
                    {item.Product?.nombre}
                  </div>
                </td>
                <td>{item.Product?.codigoTrazabilidad}</td>
                <td>
                  <span className={`stock-badge ${getStockStatus(item.quantity)}`}>
                    {item.quantity} unidades
                  </span>
                </td>
                <td>
                  <span className={`status-text ${getStockStatus(item.quantity)}`}>
                    {getStockStatusText(item.quantity)}
                  </span>
                </td>
                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Gestionar Stock de Inventario"
      >
        <form onSubmit={handleInventoryAction} className="inventory-form">
          <div className="form-group">
            <label htmlFor="product">Producto:</label>
            <select
              id="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Seleccionar producto</option>
              {products?.map(product => (
                <option key={product.id} value={product.id}>
                  {product.nombre} - {product.codigoTrazabilidad}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="actionType">Acción:</label>
            <select
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              required
            >
              <option value="add">Agregar Stock</option>
              <option value="remove">Quitar Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Cantidad:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
              {actionLoading ? 'Procesando...' : 'Ejecutar Acción'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManager;