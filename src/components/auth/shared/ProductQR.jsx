import React, { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { qrService } from '../../../services/qrService';
import LoadingSpinner from '../common/LoadingSpinner';
import './ProductQR.css';

const ProductQR = ({ productId, productName, codigoTrazabilidad }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        setLoading(true);
        const response = await qrService.getProductQR(productId);
        setQrData(response.data);
        setError(null);
      } catch (err) {
        setError('Error al generar código QR');
        console.error('Error fetching QR:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchQR();
    }
  }, [productId]);

  const downloadQR = () => {
    if (!qrData?.qrImage) return;

    const link = document.createElement('a');
    link.href = qrData.qrImage;
    link.download = `QR-${productName || productId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyLink = () => {
    if (!qrData?.url) return;
    navigator.clipboard.writeText(qrData.url);
    alert('Link copiado al portapapeles');
  };

  // Si está cargando, no mostrar nada para no interrumpir
  if (loading) {
    return null;
  }

  // Si hay error, no mostrar nada (silencioso)
  if (error || !qrData) {
    return null;
  }

  return (
    <div className="product-qr-container">
      <button 
        className="btn btn-outline qr-trigger"
        onClick={() => setShowModal(true)}
      >
        📱 Ver Código QR
      </button>

      {showModal && (
        <div className="qr-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Código QR del Producto</h3>
              <button 
                className="qr-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-info">
                <h4>{productName || 'Producto'}</h4>
                {codigoTrazabilidad && (
                  <p className="qr-code">Código: {codigoTrazabilidad}</p>
                )}
              </div>

              <div className="qr-image-container">
                <img 
                  src={qrData.qrImage} 
                  alt="Código QR del producto" 
                  className="qr-image"
                />
              </div>

              <div className="qr-actions">
                <button 
                  className="btn btn-primary"
                  onClick={downloadQR}
                >
                  📥 Descargar QR
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={copyLink}
                >
                  🔗 Copiar Link
                </button>
              </div>

              <p className="qr-instructions">
                Escanea este código QR con tu móvil para acceder rápidamente a la información del producto
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductQR;

