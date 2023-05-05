const path = require('path');
const fs = require('fs/promises');

async function getFilesInfo() {
  const files = await fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      const filename = file.name.slice(0, file.name.indexOf('.'));
      const extension = path.extname(file.name).slice(1);
      const filestats = await fs.stat(path.join(__dirname, 'secret-folder', file.name));
      console.log(`${filename} - ${extension} - ${(filestats.size / 1024).toFixed(3)}kb`);
    }
  }
}

getFilesInfo();
