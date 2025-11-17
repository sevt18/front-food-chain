import React, { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { tagService } from '../../../services/tagService';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductTags.css';

const ProductTags = ({ productId, tags: initialTags, onTagsChange }) => {
  const { user } = useAuth();
  const [tags, setTags] = useState(initialTags || []);
  const [allTags, setAllTags] = useState([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role?.nombre === 'admin';

  const { data: productTags, refetch: refetchTags, error: tagsError } = useApi(
    () => tagService.getProductTags(productId),
    [productId]
  );

  const { data: availableTags, error: allTagsError } = useApi(
    () => tagService.getAllTags(),
    []
  );
  
  // Si hay error al cargar etiquetas, no romper el renderizado
  if (tagsError && tagsError?.response?.status !== 404) {
    console.warn('Error al cargar etiquetas del producto:', tagsError);
  }

  useEffect(() => {
    if (productTags) {
      setTags(productTags);
      setSelectedTagIds(productTags.map(t => t.id));
    }
  }, [productTags]);

  useEffect(() => {
    if (availableTags) {
      setAllTags(availableTags);
    }
  }, [availableTags]);

  const handleAddTags = async () => {
    if (selectedTagIds.length === 0) return;

    setLoading(true);
    try {
      await tagService.addTagsToProduct(productId, selectedTagIds);
      await refetchTags();
      setShowAddTag(false);
      if (onTagsChange) onTagsChange();
    } catch (error) {
      console.error('Error al agregar etiquetas:', error);
      alert('Error al agregar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTag = async (tagId) => {
    if (!window.confirm('¿Eliminar esta etiqueta del producto?')) return;

    setLoading(true);
    try {
      await tagService.removeTagFromProduct(productId, tagId);
      await refetchTags();
      if (onTagsChange) onTagsChange();
    } catch (error) {
      console.error('Error al eliminar etiqueta:', error);
      alert('Error al eliminar etiqueta');
    } finally {
      setLoading(false);
    }
  };

  // Si está cargando y no hay etiquetas iniciales, no mostrar nada para no interrumpir
  if (loading && (!initialTags || initialTags.length === 0) && tags.length === 0) {
    return null;
  }

  return (
    <div className="product-tags-section">
      <div className="tags-header">
        <h3>🏷️ Etiquetas</h3>
        {isAdmin && (
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setShowAddTag(!showAddTag)}
          >
            {showAddTag ? 'Cancelar' : '+ Agregar Etiquetas'}
          </button>
        )}
      </div>

      {showAddTag && isAdmin && (
        <div className="add-tags-form">
          <div className="tags-selector">
            {allTags.map(tag => (
              <label key={tag.id} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTagIds([...selectedTagIds, tag.id]);
                    } else {
                      setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                    }
                  }}
                />
                <span
                  className="tag-preview"
                  style={{ backgroundColor: tag.color || '#22c55e' }}
                >
                  {tag.nombre}
                </span>
              </label>
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddTags}
            disabled={selectedTagIds.length === 0 || loading}
          >
            {loading ? 'Agregando...' : 'Agregar Etiquetas'}
          </button>
        </div>
      )}

      <div className="tags-list">
        {tags && tags.length > 0 ? (
          tags.map(tag => (
            <span
              key={tag.id}
              className="product-tag"
              style={{ backgroundColor: tag.color || '#22c55e' }}
            >
              {tag.nombre}
              {isAdmin && (
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveTag(tag.id)}
                  aria-label="Eliminar etiqueta"
                >
                  ✕
                </button>
              )}
            </span>
          ))
        ) : (
          <p className="no-tags">No hay etiquetas asignadas</p>
        )}
      </div>
    </div>
  );
};

export default ProductTags;

