import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../../services/productService';
import './SearchAutocomplete.css';

const SearchAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    // Cargar historial de búsquedas
    const saved = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(saved);
  }, []);

  useEffect(() => {
    // Limpiar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce de 300ms
    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Usar searchProducts con parámetros correctos
        const response = await productService.searchProducts({ query });
        const products = response.data?.data || response.data || [];
        setSuggestions(products.slice(0, 5)); // Limitar a 5 sugerencias
        setShowSuggestions(true);
      } catch (error) {
        // Error silencioso - no romper la UI
        console.warn('Error en búsqueda (no crítico):', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    setQuery(product.nombre);
    setShowSuggestions(false);
    
    // Guardar en historial
    const newHistory = [
      product.nombre,
      ...searchHistory.filter(item => item !== product.nombre)
    ].slice(0, 10); // Mantener solo las últimas 10
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    if (onSelect) {
      onSelect(product);
    } else {
      navigate(`/products/${product.id}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectFromHistory = (term) => {
    setQuery(term);
    navigate(`/products?search=${encodeURIComponent(term)}`);
    setShowSuggestions(false);
  };

  return (
    <div className="search-autocomplete">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0 || searchHistory.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-submit" aria-label="Buscar">
            🔍
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">
              <span>Buscando...</span>
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="suggestion-item no-results">
              <span>No se encontraron productos</span>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <>
              <div className="suggestions-header">Sugerencias</div>
              {suggestions.map((product) => (
                <div
                  key={product.id}
                  className="suggestion-item"
                  onClick={() => handleSelect(product)}
                >
                  <div className="suggestion-icon">📦</div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{product.nombre}</div>
                    <div className="suggestion-meta">
                      {product.tipo} • ⭐ {product.rating || 0}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {!loading && searchHistory.length > 0 && query.trim().length === 0 && (
            <>
              <div className="suggestions-header">Búsquedas recientes</div>
              {searchHistory.slice(0, 5).map((term, index) => (
                <div
                  key={index}
                  className="suggestion-item history"
                  onClick={() => selectFromHistory(term)}
                >
                  <div className="suggestion-icon">🕐</div>
                  <div className="suggestion-content">
                    <div className="suggestion-title">{term}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;

