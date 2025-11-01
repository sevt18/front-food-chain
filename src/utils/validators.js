export const validateProduct = (productData) => {
  const errors = {};

  if (!productData.nombre?.trim()) {
    errors.nombre = 'El nombre es requerido';
  }

  if (!productData.tipo?.trim()) {
    errors.tipo = 'El tipo es requerido';
  }

  if (!productData.fechaProduccion) {
    errors.fechaProduccion = 'La fecha de producción es requerida';
  }

  if (!productData.codigoTrazabilidad?.trim()) {
    errors.codigoTrazabilidad = 'El código de trazabilidad es requerido';
  }

  return errors;
};

// Esta función ya no es necesaria aquí porque la movimos a helpers.js
// export const validatePassword = (password) => { ... }