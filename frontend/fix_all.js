const fs = require('fs');
const glob = require('glob'); // Need to install? Wait, I'll just use a simple recursive function

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = require('path').join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Fixed', filePath);
    }
  }
});
