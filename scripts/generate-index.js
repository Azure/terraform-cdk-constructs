const fs = require('fs');
const path = require('path');

const baseDir = './src';
const excludeDirs = ['test', 'module', 'util', 'testing']; // Add any directories you want to exclude

function generateLibIndex(libDir) {
  // Skip core-azure/lib as it requires manual curation
  if (libDir.includes('core-azure/lib') || libDir.includes('core-azure\\lib')) {
    console.log(`index.ts skipped in ${libDir} (manually curated)`);
    return;
  }
  
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
  
  // NOTE: The main src/index.ts file is manually curated to maintain
  // documentation, structured exports, and JSII compatibility.
  // This script only regenerates module-level index.ts files.
  // To add a new module to the main index, manually edit src/index.ts
  
  console.log('⚠️  Main src/index.ts is manually curated - skipping generation');
  console.log('📝 To add new modules, manually edit src/index.ts');
  console.log('');
  console.log('Generating module-level index.ts files...');

  subdirectories.forEach(generateModuleIndex);
  
  console.log('');
  console.log('✅ Module index files generated');
  console.log('');
  console.log('Available modules:');
  subdirectories.forEach(dir => {
    const dirName = path.basename(dir).replace(/-/g, '_');
    console.log(`  - ${dirName}`);
  });
}

generateIndex();
