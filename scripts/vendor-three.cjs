const fs = require('node:fs');
const path = require('node:path');
const project = path.resolve(__dirname, '..');
for (const name of ['three.module.js', 'three.core.js']) fs.copyFileSync(path.join(project, 'node_modules/three/build', name), path.join(project, 'dist', name));
fs.copyFileSync(path.join(project, 'node_modules/three/LICENSE'), path.join(project, 'dist/THREE-LICENSE.txt'));
console.log('Three.js pinned locally; no runtime CDN dependency.');
