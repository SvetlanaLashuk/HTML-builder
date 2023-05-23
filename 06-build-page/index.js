const path = require('path');
const { readdir, mkdir, readFile, writeFile, unlink, copyFile } = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');


async function createDirectory(filepath) {
  try {
    await mkdir(filepath, { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function clearOutputDirectory(filepath) {
  try {
    const files = await readdir(filepath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await unlink(path.join(filepath, file.name));
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

const dist = path.join(__dirname, 'project-dist');
const distAssets = path.join(__dirname, 'project-dist', 'assets');
const assets = path.join(__dirname, 'assets');

async function copyFolder(assets, distAssets) {
  try {
    createDirectory(distAssets);
    clearOutputDirectory(distAssets);
    const files = await readdir(assets, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        await copyFile(path.join(assets, file.name), path.join(distAssets, file.name));
      } else if (file.isDirectory()) {
        const newAssets = path.join(assets, file.name);
        const newDistAssets = path.join(distAssets, file.name);
        await copyFolder(newAssets, newDistAssets);
      }
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function mergeStyles() {
  const writeStream = createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
  const files = await readdir(path.join(__dirname, 'styles'), { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const content = await readFile(path.join(__dirname, 'styles', file.name), 'utf-8');
      writeStream.write(content + '\n');
    }
  }
}

async function fillTemplate() {
  let template = '';
  const readTemplate = createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  readTemplate.on('data', chunk => template += chunk);
  readTemplate.on('end', () => formHtml(template));
}

async function formHtml(template) {
  const tags = template.match(/\{{(.*?)}}/g);
  for (const tag of tags) {
    const tagName = tag.slice(2, tag.length - 2);
    const data = await readFile(path.join(__dirname, 'components', `${tagName}.html`), 'utf-8');
    template = template.replace(tag, data);
  }
  await writeFile(path.join(__dirname, 'project-dist', 'index.html'), template);
}

createDirectory(dist);
fillTemplate();
mergeStyles();
copyFolder(assets, distAssets);


