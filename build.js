const fs = require('fs');
const lockfile = require('./package-lock-grid.json');
const modules = fs.readdirSync('node_modules');
for (const dependency in lockfile.dependencies) {
  if (modules.includes(dependency)) {
    fs.rmSync('node_modules/' + dependency, { recursive: true, force: true });
  }
}
console.log('Dependencies removed.')
