const fs = require('fs');
const path = require('path');

fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), err => {
  if (err) {
    console.log(err);
  }
});

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  }
  for (const file of files) {
    const currFile = path.join(__dirname, 'styles', file.name); 
    if (file.isFile() && path.extname(currFile) === '.css') {
      const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf-8');
      readStream.on('data', data => {
        fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data + '\n', err => {
          if (err) {
            console.log(err);
          }
        });
      });
    }
  }
});