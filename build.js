const fs = require('fs');
const lockfile = require('./package-lock.json');
const modules = fs.readdirSync('node_modules');
for (const dependency in lockfile.dependencies) {
  if (modules.includes(dependency)) {
    fs.rmSync('node_modules/' + dependency, { recursive: true, force: true });
  }
}
console.log('Dependencies removed.');

const archiver = require('archiver');
const output = fs.createWriteStream('my-project.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log('Zip file created.');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory('node_modules', false);
archive.finalize();
