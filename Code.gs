/**
 * Misión Emprende · Feria de Emprendimiento TP 2026
 * Respaldo en Google Drive para la app de emprendimientos.
 *
 * Cómo instalarlo:
 * 1. Abre tu Google Sheet > Extensiones > Apps Script.
 * 2. Borra lo que aparece y pega este código. Guarda.
 * 3. Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 * 4. Copia la URL que termina en /exec y pégala en la app.
 */
const HOJA_SEGUIMIENTO = 'Seguimiento';
const HOJA_ESTADO = '_estado';
const HOJA_BASE = '_base';
const TROZO = 40000;

function doGet() {
  return salida_({ state: leerJSON_(HOJA_ESTADO, vacio_()), base: leerJSON_(HOJA_BASE, []) });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const entrada = JSON.parse(e.postData.contents || '{}');
    if (entrada.base && entrada.base.length) guardarJSON_(HOJA_BASE, entrada.base);
    const combinado = combinar_(leerJSON_(HOJA_ESTADO, vacio_()), entrada.state || {});
    guardarJSON_(HOJA_ESTADO, combinado);
    if (entrada.table && entrada.table.length) escribirTabla_(entrada.table);
    return salida_({ state: combinado, base: leerJSON_(HOJA_BASE, []) });
  } finally {
    lock.releaseLock();
  }
}

function vacio_() { return { r: {}, c: {}, g: {} }; }

function leerJSON_(nombre, porDefecto) {
  const hoja = libro_().getSheetByName(nombre);
  if (!hoja || hoja.getLastRow() === 0) return porDefecto;
  const texto = hoja.getRange(1, 1, hoja.getLastRow(), 1).getValues()
    .map(f => String(f[0]).replace(/^~/, '')).join('');
  return texto ? JSON.parse(texto) : porDefecto;
}

function guardarJSON_(nombre, obj) {
  const libro = libro_();
  const hoja = libro.getSheetByName(nombre) || libro.insertSheet(nombre);
  const texto = JSON.stringify(obj);
  const filas = [];
  for (let i = 0; i < texto.length; i += TROZO) filas.push(['~' + texto.slice(i, i + TROZO)]);
  hoja.clear();
  hoja.getRange(1, 1, filas.length, 1).setNumberFormat('@').setValues(filas);
  if (!hoja.isSheetHidden()) hoja.hideSheet();
}

function escribirTabla_(filas) {
  const libro = libro_();
  const hoja = libro.getSheetByName(HOJA_SEGUIMIENTO) || libro.insertSheet(HOJA_SEGUIMIENTO, 0);
  hoja.clearContents();
  hoja.getRange(1, 1, filas.length, filas[0].length).setNumberFormat('@').setValues(filas);
  hoja.getRange(1, 1, 1, filas[0].length).setFontWeight('bold').setBackground('#f3e9e1');
  hoja.setFrozenRows(1);
}

function combinar_(a, b) {
  const elegir = (x, y) => {
    const o = Object.assign({}, x || {});
    Object.keys(y || {}).forEach(k => {
      if (!o[k] || (y[k].ts || 0) > (o[k].ts || 0)) o[k] = y[k];
    });
    return o;
  };
  const g = (b.g && (b.g.ts || 0) > ((a.g || {}).ts || 0)) ? b.g : (a.g || {});
  return { r: elegir(a.r, b.r), c: elegir(a.c, b.c), g: g };
}

function libro_() { return SpreadsheetApp.getActiveSpreadsheet(); }

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
