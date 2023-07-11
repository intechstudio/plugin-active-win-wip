const fs = require('fs');
const archiver = require('archiver');
const lockfile = require('./package-lock-grid.json');
const modules = fs.readdirSync('node_modules');
const output = fs.createWriteStream('plugin-active-win.zip');
const archive = archiver('zip', { zlib: { level: 1 } });

archive.pipe(output);

// Remove dependencies from node_modules
for (const dependency in lockfile.dependencies) {
  if (modules.includes(dependency)) {
    fs.rmSync(`node_modules/${dependency}`, { recursive: true, force: true });
  }
}

// Exclude files and directories from the archive
const excludedFiles = ['archive.js', 'build.js', 'package-lock-grid.json', '.github'];
for (const file of excludedFiles) {
  archive.glob(`!${file}`, { cwd: '.', dot: true });
}

// Add remaining files to the archive
archive.directory('.', false);
archive.finalize();

console.log('Dependencies removed and archive created.');
