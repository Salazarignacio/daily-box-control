
export const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return '';
  const n = parseFloat(val);
  if (isNaN(n)) return '';
  return new Intl.NumberFormat('es-AR').format(n);
};

export const parseNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // En Argentina, el punto es separador de miles y la coma es decimal.
  // Para parsear a JS (que usa punto decimal), quitamos los puntos y cambiamos la coma por punto.
  const clean = val.toString().replace(/\./g, '').replace(',', '.');
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
};

export const getNum = (val) => parseNumber(val);
