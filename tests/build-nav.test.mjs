import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { buildNav } from '../tools/build-nav.mjs';

/** Crea un docs/ temporal a partir de { 'ruta/archivo': 'contenido' }. */
async function fixture(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'docs-nav-'));
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(dir, rel);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
  return dir;
}

async function nav(files) {
  const dir = await fixture(files);
  try { return await buildNav(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}

test('cada carpeta es una sección y cada .md una página', async () => {
  const result = await nav({
    'guia/uno.md': '# Uno\n',
    'guia/dos.md': '# Dos\n',
  });
  assert.deepEqual(result, [{
    title: 'Guia',
    items: [
      { title: 'Dos', path: 'guia/dos' },
      { title: 'Uno', path: 'guia/uno' },
    ],
  }]);
});

test('el título sale del front matter, luego del primer H1, luego del nombre', async () => {
  const result = await nav({
    'a/x.md': '---\ntitle: Desde front matter\n---\n# Otro título\n',
    'a/y.md': 'texto\n\n# Desde el H1\n',
    'a/mi-archivo.md': 'sin encabezado\n',
  });
  const titles = result[0].items.map((i) => i.title);
  assert.deepEqual(titles.sort(), ['Desde el H1', 'Desde front matter', 'Mi archivo']);
});

test('un # dentro de un bloque de código no cuenta como título', async () => {
  const result = await nav({ 'a/pagina.md': '```bash\n# comentario\n```\n' });
  assert.equal(result[0].items[0].title, 'Pagina');
});

test('el orden usa order, luego prefijo numérico, luego alfabético', async () => {
  const result = await nav({
    'a/zeta.md': '---\norder: 1\n---\n# Zeta\n',
    'a/10-diez.md': '# Diez\n',
    'a/02-dos.md': '# Dos\n',
    'a/beta.md': '# Beta\n',
    'a/alfa.md': '# Alfa\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Zeta', 'Dos', 'Diez', 'Alfa', 'Beta']);
});

test('los prefijos se comparan como números, no como texto', async () => {
  const result = await nav({ 'a/2-b.md': '# B\n', 'a/10-j.md': '# J\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['B', 'J']);
});

test('_meta.json fija título y orden de la carpeta', async () => {
  const result = await nav({
    'b/p.md': '# P\n',
    'b/_meta.json': '{ "title": "Sección B", "order": 2 }',
    'a/p.md': '# P\n',
    'a/_meta.json': '{ "title": "Sección A", "order": 1 }',
  });
  assert.deepEqual(result.map((s) => s.title), ['Sección A', 'Sección B']);
});

test('index.md de una sección aparece como primera página', async () => {
  const result = await nav({
    's/index.md': '# Resumen\n',
    's/otra.md': '# Otra\n',
  });
  assert.deepEqual(result[0].items.map((i) => i.path), ['s/index', 's/otra']);
});

test('index.md de una subcarpeta es la página del grupo y no se repite como hijo', async () => {
  const result = await nav({
    's/g/index.md': '# Grupo\n',
    's/g/hijo.md': '# Hijo\n',
  });
  assert.deepEqual(result[0].items, [{
    title: 'Grupo',
    path: 's/g/index',
    items: [{ title: 'Hijo', path: 's/g/hijo' }],
  }]);
});

test('subcarpeta sin index.md es un grupo sin enlace', async () => {
  const result = await nav({ 's/g/hijo.md': '# Hijo\n' });
  assert.equal(result[0].items[0].title, 'G');
  assert.equal(result[0].items[0].path, undefined);
  assert.equal(result[0].items[0].items.length, 1);
});

test('se ignoran _ocultos, .ocultos, carpetas sin .md y archivos que no son .md', async () => {
  const result = await nav({
    'a/visible.md': '# Visible\n',
    'a/_borrador.md': '# Oculto\n',
    '_privado/x.md': '# Oculto\n',
    '.git/x.md': '# Oculto\n',
    'img/foto.png': 'binario',
    'a/notas.txt': 'no md',
  });
  assert.deepEqual(result, [{ title: 'A', items: [{ title: 'Visible', path: 'a/visible' }] }]);
});

test('docs/index.md es la portada y no entra en el menú', async () => {
  const result = await nav({ 'index.md': '# Portada\n', 'a/p.md': '# P\n' });
  assert.equal(result.length, 1);
  assert.equal(result[0].items[0].path, 'a/p');
});

test('los .md sueltos van a una sección raíz, primera, con nombre configurable', async () => {
  const result = await nav({
    'suelto.md': '# Suelto\n',
    'a/p.md': '# P\n',
    'config.json': '{ "site": { "rootSection": "Básicos" } }',
  });
  assert.equal(result[0].title, 'Básicos');
  assert.deepEqual(result[0].items, [{ title: 'Suelto', path: 'suelto' }]);
});

test('el orden alfabético respeta el español (acentos y ñ)', async () => {
  const result = await nav({ 'a/ñu.md': '# Ñu\n', 'a/zorro.md': '# Zorro\n', 'a/árbol.md': '# Árbol\n', 'a/ola.md': '# Ola\n' });
  assert.deepEqual(result[0].items.map((i) => i.title), ['Árbol', 'Ñu', 'Ola', 'Zorro']);
});

test('docs vacío produce un menú vacío', async () => {
  assert.deepEqual(await nav({ 'config.json': '{}' }), []);
});
