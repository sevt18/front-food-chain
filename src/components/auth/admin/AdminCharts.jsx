import React, { useMemo } from 'react';
import { useApi } from '../../../hooks/useApi';
import { productService } from '../../../services/productService';
import { adminService } from '../../../services/adminService';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../common/Charts';
import LoadingSpinner from '../common/LoadingSpinner';
import './AdminComponents.css';

const AdminCharts = () => {
  const { data: productsResponse } = useApi(productService.getProducts);
  const { data: stats } = useApi(adminService.getStats);

  // Normalizar productos: puede venir como array directo, objeto con data, o objeto paginado
  const products = Array.isArray(productsResponse) 
    ? productsResponse 
    : productsResponse?.data || productsResponse?.products || [];

  const productsByType = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    const typeCount = {};
    products.forEach(product => {
      typeCount[product.tipo] = (typeCount[product.tipo] || 0) + 1;
    });
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  }, [products]);

  const productsByRating = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    const ratingRanges = {
      '0-1': 0,
      '1-2': 0,
      '2-3': 0,
      '3-4': 0,
      '4-5': 0
    };
    products.forEach(product => {
      const rating = product.rating || 0;
      if (rating < 1) ratingRanges['0-1']++;
      else if (rating < 2) ratingRanges['1-2']++;
      else if (rating < 3) ratingRanges['2-3']++;
      else if (rating < 4) ratingRanges['3-4']++;
      else ratingRanges['4-5']++;
    });
    return Object.entries(ratingRanges).map(([name, value]) => ({ name, value }));
  }, [products]);

  const monthlyProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    const monthCount = {};
    products.forEach(product => {
      const date = new Date(product.fechaProduccion);
      const month = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      monthCount[month] = (monthCount[month] || 0) + 1;
    });
    return Object.entries(monthCount)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([name, value]) => ({ name, value }));
  }, [products]);

  // Mostrar loading si no hay datos o si products no es un array válido
  if (!Array.isArray(products) || !stats) {
    return <LoadingSpinner text="Cargando gráficos..." />;
  }
  
  // Si no hay productos, mostrar mensaje
  if (products.length === 0) {
    return (
      <div className="admin-charts">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No hay productos disponibles para mostrar gráficos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-charts">
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Productos por Tipo</h3>
          <PieChartComponent data={productsByType} dataKey="value" />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Distribución de Ratings</h3>
          <BarChartComponent data={productsByRating} dataKey="value" name="Productos" />
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Productos por Mes</h3>
          <LineChartComponent data={monthlyProducts} dataKey="value" name="Productos" />
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;

