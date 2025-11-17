import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getInitials } from '../../../utils/helpers';
import DarkModeToggle from './DarkModeToggle';
import NotificationCenter from './NotificationCenter';
import SearchAutocomplete from '../shared/SearchAutocomplete';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowMenu(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getRoleName = () => {
    if (!user || !user.role) return '';
    // Si role es un objeto, extraer el nombre; si es string, usarlo directamente
    return typeof user.role === 'object' ? user.role.nombre : user.role;
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const role = getRoleName();
    switch (role) {
      case 'admin': return '/admin';
      case 'distribuidor': return '/distributor';
      default: return '/visitor';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <section className="logo">
          <Link to={getDashboardPath()}>
            <h2>🌱 FOODCHAIN</h2>
          </Link>
        </section>

        <nav className="nav" aria-label="Navegación principal">
          {user && (
            <>
              <section className="nav-search" aria-label="Búsqueda">
                <SearchAutocomplete />
              </section>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              >
                Productos
              </Link>

              {getRoleName() === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  Administración
                </Link>
              )}

              {getRoleName() === 'distribuidor' && (
                <>
                  <Link 
                    to="/distributor/inventory" 
                    className={`nav-link ${isActive('/distributor/inventory') ? 'active' : ''}`}
                  >
                    Inventario
                  </Link>
                  <Link 
                    to="/distributor/batches" 
                    className={`nav-link ${isActive('/distributor/batches') ? 'active' : ''}`}
                  >
                    Lotes
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        <section className="header-actions" aria-label="Acciones del usuario">
          <DarkModeToggle />
          {user && <NotificationCenter />}
          {user ? (
            <section className="user-info">
              <button 
                className="user-btn"
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Menú de usuario"
                aria-expanded={showMenu}
              >
                <span className="user-avatar" aria-hidden="true">
                  {getInitials(user.nombre)}
                </span>
                <span className="user-name">{user.nombre || 'Usuario'}</span>
                <span className="user-role">({getRoleName()})</span>
              </button>

              {showMenu && (
                <menu className="dropdown-menu" role="menu">
                  <li role="menuitem">
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </menu>
              )}
            </section>
          ) : (
            <nav className="auth-links" aria-label="Enlaces de autenticación">
              <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </nav>
          )}
        </section>
      </div>
    </header>
  );
};

export default Header;