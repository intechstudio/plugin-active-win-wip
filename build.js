const fs = require('fs');
const archiver = require('archiver');
const lockfile = require('./package-lock-grid.json');
const modules = fs.readdirSync('node_modules');
const output = fs.createWriteStream('plugin-active-win.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

// Remove dependencies from node_modules
/*for (const dependency in lockfile.dependencies) {
  if (modules.includes(dependency)) {
    fs.rmSync(`node_modules/${dependency}`, { recursive: true, force: true });
  }
}*/

const subfolder = 'my-project-files';
if (!fs.existsSync(subfolder)) {
  fs.mkdirSync(subfolder);
}

const excludedFiles = [subfolder, 'archive.js', 'build.js', 'package-lock-grid.json', '.github', '.git'];

// Get all files and directories in the current folder
const files = fs.readdirSync('.');
for (const file of files) {
  // Exclude the excluded files/directories
  if (!excludedFiles.includes(file)) {
	fs.renameSync(file, `${subfolder}/${file}`);
  }
}

output.on('close', () => {
  console.log('Archive created successfully.');
});

archive.pipe(output);
archive.directory(subfolder, false);
archive.finalize();

console.log('Dependencies removed and archive created.');
