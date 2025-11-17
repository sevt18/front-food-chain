import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Importar jspdf-autotable como side-effect import
// Esto agrega el método autoTable al prototipo de jsPDF
import 'jspdf-autotable';

export const exportToPDF = (data, columns, filename = 'reporte') => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text(filename, 14, 15);
  
  // Tabla - autoTable se agrega automáticamente al prototipo de jsPDF después del import
  // @ts-ignore
  if (typeof doc.autoTable !== 'undefined') {
    // @ts-ignore
    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: data.map(row => columns.map(col => row[col.key] || '')),
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 139, 202] }
    });
  } else {
    // Fallback: crear una tabla simple sin autoTable
    let y = 30;
    doc.setFontSize(10);
    // Headers
    columns.forEach((col, index) => {
      doc.text(col.header, 14 + (index * 40), y);
    });
    y += 10;
    // Data
    data.forEach(row => {
      columns.forEach((col, index) => {
        doc.text(String(row[col.key] || ''), 14 + (index * 40), y);
      });
      y += 7;
    });
  }
  
  doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data, columns, filename = 'reporte') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(row => {
      const obj = {};
      columns.forEach(col => {
        obj[col.header] = row[col.key] || '';
      });
      return obj;
    })
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportProductsToPDF = (products) => {
  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'codigoTrazabilidad', header: 'Código' },
    { key: 'rating', header: 'Rating' },
    { key: 'isAvailable', header: 'Disponible' },
    { key: 'fechaProduccion', header: 'Fecha Producción' }
  ];
  
  const data = products.map(product => ({
    ...product,
    isAvailable: product.isAvailable ? 'Sí' : 'No',
    fechaProduccion: new Date(product.fechaProduccion).toLocaleDateString('es-ES')
  }));
  
  exportToPDF(data, columns, 'productos');
};

export const exportProductsToExcel = (products) => {
  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'codigoTrazabilidad', header: 'Código' },
    { key: 'rating', header: 'Rating' },
    { key: 'isAvailable', header: 'Disponible' },
    { key: 'fechaProduccion', header: 'Fecha Producción' }
  ];
  
  exportToExcel(products, columns, 'productos');
};

