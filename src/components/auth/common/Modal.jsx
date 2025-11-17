import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal-overlay" onClick={onClose} open>
      <article className={`modal-content ${size}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </header>
        <section className="modal-body">
          {children}
        </section>
      </article>
    </dialog>
  );
};

export default Modal;