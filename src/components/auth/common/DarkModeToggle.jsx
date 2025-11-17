import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Verificar localStorage al inicializar
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      // Aplicar inmediatamente al cargar
      if (parsed) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      return parsed;
    }
    return false;
  });

  useEffect(() => {
    // Aplicar o remover la clase cuando cambia el estado
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark-mode');
    } else {
      htmlElement.classList.remove('dark-mode');
    }
    // Guardar en localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    
    // Actualizar el tema del ToastContainer si existe
    const toastContainer = document.querySelector('.Toastify__toast-container');
    if (toastContainer) {
      toastContainer.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      className="dark-mode-toggle"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;

