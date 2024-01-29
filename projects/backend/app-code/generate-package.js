const fs = require('fs');

const originalPackageJsonPath = './package.json';
const distPackageJsonPath = './dist/package.json';
const originalPackageJsonContent = fs.readFileSync(originalPackageJsonPath, 'utf-8');
const originalPackageJsonObject = JSON.parse(originalPackageJsonContent);
const desiredProperties = ['name', 'version', 'author', 'main', 'dependencies'];
const newPackageJsonObject = {};
desiredProperties.forEach((property) => {
  if (originalPackageJsonObject.hasOwnProperty(property)) {
    newPackageJsonObject[property] = originalPackageJsonObject[property];
  }
});
newPackageJsonObject.main = 'server.js';
const newPackageJsonContent = JSON.stringify(newPackageJsonObject, null, 2);
fs.writeFileSync(distPackageJsonPath, newPackageJsonContent);

console.log('Novo arquivo package.json criado em ./dist/package.json');
