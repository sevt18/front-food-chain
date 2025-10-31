export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
  }

  return errors;
};

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