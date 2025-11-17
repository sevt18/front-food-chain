import React from 'react';
import './TraceabilityTimeline.css';

const TraceabilityTimeline = ({ productId, stages = [] }) => {
  // Si no hay stages, mostramos información básica de trazabilidad
  if (!stages || stages.length === 0) {
    return (
      <div className="traceability-timeline">
        <div className="timeline-header">
          <h2>Trazabilidad del Producto</h2>
        </div>
        <div className="timeline-content">
          <div className="timeline-item">
            <div className="timeline-marker">
              <span>📦</span>
            </div>
            <div className="timeline-content-item">
              <h3>Información de Trazabilidad</h3>
              <p>
                El sistema de trazabilidad permite rastrear el recorrido completo 
                del producto desde su origen hasta el consumidor final. Cada etapa 
                del proceso queda registrada para garantizar la transparencia y 
                calidad del producto.
              </p>
              <p className="info-note">
                💡 Las etapas detalladas de trazabilidad estarán disponibles próximamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="traceability-timeline">
      <div className="timeline-header">
        <h2>Trazabilidad del Producto</h2>
        <p>Historial completo del producto</p>
      </div>
      <div className="timeline-content">
        {stages.map((stage, index) => (
          <div key={stage.id} className="timeline-item">
            <div className="timeline-marker">
              <span>{index + 1}</span>
            </div>
            <div className="timeline-content-item">
              <h3>{stage.estado}</h3>
              <p className="timeline-date">
                {new Date(stage.fechaHora).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {stage.actor && (
                <p className="timeline-actor">
                  Responsable: {stage.actor.nombre}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraceabilityTimeline;

