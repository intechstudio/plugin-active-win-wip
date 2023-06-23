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
