import React, { useState } from 'react';
import { imageService } from '../../../services/imageService';
import { useApi } from '../../../hooks/useApi';
import { notify } from '../../../utils/notifications';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import './ProductImages.css';

const ProductImages = ({ productId, canEdit = false }) => {
  const { data: images, loading, error, refetch } = useApi(
    () => imageService.getProductImages(productId),
    [productId]
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageDesc, setImageDesc] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      notify.error('Por favor ingresa una URL de imagen');
      return;
    }

    setUploading(true);
    try {
      await imageService.uploadImage(productId, {
        url: imageUrl.trim(),
        descripcion: imageDesc.trim() || null
      });
      notify.success('Imagen agregada correctamente');
      setShowUploadModal(false);
      setImageUrl('');
      setImageDesc('');
      await refetch();
    } catch (error) {
      notify.error(error.response?.data?.error || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      await imageService.deleteImage(imageId);
      notify.success('Imagen eliminada correctamente');
      await refetch();
    } catch (error) {
      notify.error(error.response?.data?.error || 'Error al eliminar la imagen');
    }
  };

  if (loading) {
    return (
      <div className="product-images-section">
        <div className="section-header-images">
          <h3>📷 Imágenes del Producto</h3>
        </div>
        <LoadingSpinner text="Cargando imágenes..." />
      </div>
    );
  }

  return (
    <div className="product-images-section">
      <div className="section-header-images">
        <h3>📷 Imágenes del Producto</h3>
        {canEdit && (
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            + Agregar Imagen
          </button>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ padding: '1rem', marginBottom: '1rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-md)', color: 'var(--danger-color)' }}>
          ⚠️ No se pudieron cargar las imágenes. {error.response?.status === 404 ? 'El endpoint aún no está disponible en el backend.' : 'Intenta recargar la página.'}
          {canEdit && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              Puedes agregar imágenes de todas formas usando el botón "+ Agregar Imagen"
            </div>
          )}
        </div>
      )}

      {!error && images && images.length > 0 ? (
        <div className="images-grid">
          {images.map(image => (
            <div key={image.id} className="image-card">
              <img 
                src={image.url} 
                alt={image.descripcion || 'Imagen del producto'}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
                }}
              />
              {image.descripcion && (
                <p className="image-description">{image.descripcion}</p>
              )}
              {canEdit && (
                <button
                  className="btn-delete-image"
                  onClick={() => handleDelete(image.id)}
                  title="Eliminar imagen"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      ) : !error ? (
        <div className="empty-images">
          <p>No hay imágenes disponibles para este producto</p>
          {canEdit && (
            <button 
              className="btn btn-outline"
              onClick={() => setShowUploadModal(true)}
            >
              Agregar Primera Imagen
            </button>
          )}
        </div>
      ) : null}

      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setImageUrl('');
          setImageDesc('');
        }}
        title="Agregar Imagen"
      >
        <form onSubmit={handleUpload} className="image-upload-form">
          <div className="form-group">
            <label htmlFor="imageUrl">URL de la Imagen *</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            <small className="form-hint">
              Ingresa la URL completa de la imagen
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="imageDesc">Descripción (opcional)</label>
            <textarea
              id="imageDesc"
              value={imageDesc}
              onChange={(e) => setImageDesc(e.target.value)}
              placeholder="Descripción de la imagen..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setShowUploadModal(false);
                setImageUrl('');
                setImageDesc('');
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading || !imageUrl.trim()}
            >
              {uploading ? 'Subiendo...' : 'Agregar Imagen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductImages;

