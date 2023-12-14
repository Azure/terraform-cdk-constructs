const fs = require('fs');
const path = require('path');

const baseDir = './src';
const excludeDirs = ['test', 'module', 'util', 'testing']; // Add any directories you want to exclude

function generateLibIndex(libDir) {
  const files = fs.readdirSync(libDir, { withFileTypes: true });
  const exports = files
    .filter(file => file.isFile() && file.name.endsWith('.ts') && file.name !== 'index.ts')
    .map(file => `export * from './${path.basename(file.name, '.ts')}';\n`)
    .join('');

  fs.writeFileSync(path.join(libDir, 'index.ts'), exports);
  console.log(`index.ts generated in ${libDir}`);
}

function generateModuleIndex(moduleDir) {
  const libDir = path.join(moduleDir, 'lib');
  if (fs.existsSync(libDir) && fs.statSync(libDir).isDirectory()) {
    generateLibIndex(libDir);
    const exportStatement = `export * from './lib';\n`;
    fs.writeFileSync(path.join(moduleDir, 'index.ts'), exportStatement);
    console.log(`index.ts generated in ${moduleDir}`);
  }
}

function findSubdirectories(dir, dirList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      dirList.push(path.join(dir, entry.name));
    }
  });
  return dirList;
}

function generateIndex() {
  const subdirectories = findSubdirectories(baseDir);
  const exports = subdirectories.map(dir => {
    const dirName = path.basename(dir).replace(/-/g, '_');
    const relativePath = path.relative(baseDir, dir);
    return `export * as ${dirName} from './${relativePath}';\n`;
  }).join('');

  fs.writeFileSync(path.join(baseDir, 'index.ts'), exports);
  console.log('index.ts generated in src');

  subdirectories.forEach(generateModuleIndex);
}

generateIndex();
