const path = require('path');
const { readdir, mkdir, unlink, copyFile } = require('node:fs/promises');

const inputDir = path.join(__dirname, 'files');
const outputDir = path.join(__dirname, 'files-copy');

async function createDirectory() {
  try {
    await mkdir(outputDir, { recursive: true });
  } catch(err) {
    console.error(err.message);
  }
}

async function clearOutputDirectory() {
  try {
    const files = await readdir(outputDir, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
        await unlink(path.join(__dirname, 'files-copy', file.name));
      }
    }
  } catch(err) {
    console.error(err.message);
  }
}

async function copyFiles() {
  try {
    createDirectory();
    clearOutputDirectory();
    const files = await readdir(inputDir, {withFileTypes: true});
    for (const file of files) {
      if(file.isFile()) {
        await copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name));
      }
    }
  } catch(err) {
    console.error(err.message);
  }
}

copyFiles();
