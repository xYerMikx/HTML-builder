const fs = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function readDir(dirPath) {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const fileName = file.name;
      const fileExt = path.extname(fileName).slice(1);
      const stats = await fs.stat(path.join(dirPath, fileName));
      const fileSize = Math.round(stats.size / 1024 * 1000) / 1000;

      console.log(`\n${fileName} - ${fileExt} - ${fileSize}` + ' kB');
    }
  }
}

readDir(dirPath);