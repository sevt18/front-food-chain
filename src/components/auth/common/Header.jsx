import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
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

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'distribuidor': return '/distributor';
      default: return '/visitor';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to={getDashboardPath()}>
            <h2>🌱 Trazabilidad</h2>
          </Link>
        </div>

        <nav className="nav">
          {user && (
            <>
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              >
                Productos
              </Link>

              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  Administración
                </Link>
              )}

              {user.role === 'distribuidor' && (
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

        <div className="user-menu">
          {user ? (
            <div className="user-info">
              <button 
                className="user-btn"
                onClick={() => setShowMenu(!showMenu)}
              >
                <div className="user-avatar">
                  {getInitials(user.nombre)}
                </div>
                <span className="user-name">{user.nombre}</span>
                <span className="user-role">({user.role})</span>
              </button>

              {showMenu && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;