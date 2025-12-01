const fs = require('fs');
const path = require('path');

// التحويلات المطلوبة
const replacements = [
  // margin
  { from: /margin-left:\s*([^;]+);/g, to: 'margin-inline-start: $1;' },
  { from: /margin-right:\s*([^;]+);/g, to: 'margin-inline-end: $1;' },
  
  // padding
  { from: /padding-left:\s*([^;]+);/g, to: 'padding-inline-start: $1;' },
  { from: /padding-right:\s*([^;]+);/g, to: 'padding-inline-end: $1;' },
  
  // border
  { from: /border-left:\s*([^;]+);/g, to: 'border-inline-start: $1;' },
  { from: /border-right:\s*([^;]+);/g, to: 'border-inline-end: $1;' },
  
  // position - يجب أن نكون حذرين مع left/right في context آخر
  { from: /([\s{;])left:\s*([^;]+);/g, to: '$1inset-inline-start: $2;' },
  { from: /([\s{;])right:\s*([^;]+);/g, to: '$1inset-inline-end: $2;' },
];

function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // تطبيق جميع التحويلات
    replacements.forEach(({ from, to }) => {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(__dirname, filePath);
      console.log(`✓ Converted: ${relativePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// ملفات Bootstrap CSS المطلوب تحويلها
const bootstrapCssFiles = [
  path.join(__dirname, 'assets', 'css', 'bootstrap.css'),
  path.join(__dirname, 'assets', 'css', 'bootstrap-grid.css'),
  path.join(__dirname, 'assets', 'css', 'bootstrap-reboot.css'),
  path.join(__dirname, 'assets', 'css', 'bootstrap-utilities.css'),
];

console.log(`Converting Bootstrap CSS files...\n`);

let convertedCount = 0;
bootstrapCssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (convertFile(file)) {
      convertedCount++;
    }
  } else {
    console.log(`⚠ File not found: ${file}`);
  }
});

console.log(`\n✓ Conversion complete! ${convertedCount} files modified out of ${bootstrapCssFiles.length} total files.`);

