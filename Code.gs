/**
 * Misión Emprende · Feria de Emprendimiento TP 2026
 * Respaldo en Google Drive para la app de emprendimientos.
 *
 * Cómo instalarlo:
 * 1. Abre tu Google Sheet > Extensiones > Apps Script.
 * 2. Borra lo que aparece y pega este código. Guarda.
 * 3. Implementar > Nueva implementación > Aplicación web.
 *    Ejecutar como: Yo. Quién tiene acceso: Cualquier persona.
 * 4. Si cambias el código: Implementar > Administrar implementaciones >
 *    lápiz > Versión: Nueva versión > Implementar (la URL no cambia).
 */
const HOJA_SEGUIMIENTO = 'Seguimiento';
const HOJA_ESTADO = '_estado';
const HOJA_BASE = 'Base';
const HOJA_CONFIG = '_config';
const COLUMNAS = ['id','site','tier','score','emp','sub','food','nombre','primer','tel','email','apoyo','apoyoTel','rel','desc'];
const TROZO = 40000;

function doGet(e) {
  if (!autorizado_(e && e.parameter && e.parameter.k)) return salida_({ error: 'clave' });
  return salida_({ auth: true, state: leerJSON_(HOJA_ESTADO, vacio_()), base: leerBase_() });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const entrada = JSON.parse(e.postData.contents || '{}');
    if (!autorizado_(entrada.k)) return salida_({ error: 'clave' });
    if (entrada.base && entrada.base.length) escribirBase_(entrada.base);
    const combinado = combinar_(leerJSON_(HOJA_ESTADO, vacio_()), entrada.state || {});
    guardarJSON_(HOJA_ESTADO, combinado);
    if (entrada.table && entrada.table.length) escribirTabla_(entrada.table);
    return salida_({ auth: true, state: combinado, base: leerBase_() });
  } finally {
    lock.releaseLock();
  }
}

function vacio_() { return { r: {}, c: {}, g: {} }; }

// La clave del equipo vive en la hoja oculta _config (celda B1), nunca en GitHub.
function autorizado_(k) {
  const hoja = libro_().getSheetByName(HOJA_CONFIG);
  const clave = hoja ? String(hoja.getRange('B1').getValue()).trim() : '';
  return !!clave && String(k || '').trim().toUpperCase() === clave.toUpperCase();
}

// La hoja "Base" tiene un emprendimiento por fila; se puede editar a mano.
function leerBase_() {
  const hoja = libro_().getSheetByName(HOJA_BASE);
  if (!hoja || hoja.getLastRow() < 2) return [];
  const filas = hoja.getDataRange().getValues();
  const cab = filas.shift().map(String);
  return filas.filter(f => String(f[0]).trim() !== '').map(f => {
    const o = {};
    cab.forEach((c, i) => {
      const v = f[i];
      if (c === 'id' || c === 'score') o[c] = Number(v) || 0;
      else if (c === 'food') o[c] = v === true || String(v).toUpperCase() === 'SI';
      else o[c] = v === null || v === undefined ? '' : String(v);
    });
    return o;
  });
}

function escribirBase_(lista) {
  const libro = libro_();
  const hoja = libro.getSheetByName(HOJA_BASE) || libro.insertSheet(HOJA_BASE);
  const filas = [COLUMNAS].concat(lista.map(o => COLUMNAS.map(c => c === 'food' ? (o[c] ? 'SI' : '') : (o[c] === undefined ? '' : o[c]))));
  hoja.clearContents();
  hoja.getRange(1, 1, filas.length, COLUMNAS.length).setNumberFormat('@').setValues(filas.map(f => f.map(String)));
}

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
