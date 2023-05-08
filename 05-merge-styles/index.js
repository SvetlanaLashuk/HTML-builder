const path = require('path');
const { readdir, readFile } = require('fs/promises');
const { createWriteStream } = require('fs');

async function mergeStyles() {
  const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
  const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const content = await readFile(path.join(__dirname, 'styles', file.name), 'utf-8');
      writeStream.write(content +'\n');
    }
  }
}

mergeStyles();
