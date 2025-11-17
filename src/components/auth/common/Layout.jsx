import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;