const path = require('path');
const { stdin, stdout, exit } = process;
const fs = require('fs');

const filePath = path.join(__dirname, 'destination.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Hello! Enter some text:\n');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    exit();
  }
  output.write(data);
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Good bye!\n'));
