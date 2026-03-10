const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const sourceDir = path.resolve('..', 'chetakplus-elevated-main', 'src');
const targetDir = path.resolve('.', 'src');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function convertFile(srcFile, destFile) {
  let code = fs.readFileSync(srcFile, 'utf8');
  
  if (srcFile.endsWith('.ts') || srcFile.endsWith('.tsx')) {
    const outExt = srcFile.endsWith('.tsx') ? '.jsx' : '.js';
    let outputDest = destFile.replace(/\.tsx?$/, outExt);
    
    try {
      const result = babel.transformSync(code, {
        filename: srcFile,
        presets: [
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }]
        ],
        retainLines: true,
        generatorOpts: {
          retainLines: true,
          compact: false
        }
      });
      
      let finalCode = result.code;
      finalCode = finalCode.replace(/from\s+['"]([^'"]+)\.tsx['"]/g, 'from "$1.jsx"');
      finalCode = finalCode.replace(/from\s+['"]([^'"]+)\.ts['"]/g, 'from "$1.js"');
      finalCode = finalCode.replace(/import\(['"]([^'"]+)\.tsx['"]\)/g, 'import("$1.jsx")');
      finalCode = finalCode.replace(/import\(['"]([^'"]+)\.ts['"]\)/g, 'import("$1.js")');

      fs.writeFileSync(outputDest, finalCode, 'utf8');
      console.log(`Transpiled: ${srcFile} -> ${outputDest}`);
    } catch (e) {
      console.error(`Error processing ${srcFile}:`, e.message);
      fs.writeFileSync(outputDest, code, 'utf8');
    }
  } else {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied: ${srcFile} -> ${destFile}`);
  }
}

function processDirectory(currentSrcDir, currentDestDir) {
  ensureDirSync(currentDestDir);
  const items = fs.readdirSync(currentSrcDir);
  
  for (const item of items) {
    const srcPath = path.join(currentSrcDir, item);
    const destPath = path.join(currentDestDir, item);
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      processDirectory(srcPath, destPath);
    } else {
      convertFile(srcPath, destPath);
    }
  }
}

console.log('Starting migration...');
processDirectory(sourceDir, targetDir);
console.log('Migration complete!');
