const { readdirSync, copyFileSync, mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const project = path.resolve(__dirname, '..');
const source = path.join(project, 'dist');
const destination = path.join(project, 'docs');
mkdirSync(destination, { recursive: true });
for (const entry of readdirSync(source, { withFileTypes: true })) {
  if (!entry.isFile()) throw new Error(`Unsupported nested asset: ${entry.name}`);
  copyFileSync(path.join(source, entry.name), path.join(destination, entry.name));
}
writeFileSync(path.join(destination, '.nojekyll'), '');
console.log('GitHub Pages assets prepared in docs/');
