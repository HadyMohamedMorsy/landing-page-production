const fs = require('fs');
const path = require('path');

// دالة للبحث عن جميع ملفات SCSS بشكل recursive
function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findScssFiles(filePath, fileList);
    } else if (file.endsWith('.scss')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

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
  // نستخدم lookbehind للتأكد من أنها ليست جزء من كلمة أخرى
  { from: /([\s{;])left:\s*([^;]+);/g, to: '$1inset-inline-start: $2;' },
  { from: /([\s{;])right:\s*([^;]+);/g, to: '$1inset-inline-end: $2;' },
];

function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalContent = content;
    
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

// البحث عن جميع ملفات SCSS (بما في ذلك Bootstrap)
const scssDir = path.join(__dirname, 'assets', 'scss');
const bootstrapScssDir = path.join(__dirname, 'assets', 'vendor', 'bootstrap', 'scss');

const scssFiles = [
  ...findScssFiles(scssDir),
  ...findScssFiles(bootstrapScssDir)
];

console.log(`Found ${scssFiles.length} SCSS files to process (including Bootstrap)...\n`);

let convertedCount = 0;
scssFiles.forEach(file => {
  if (convertFile(file)) {
    convertedCount++;
  }
});

console.log(`\n✓ Conversion complete! ${convertedCount} files modified out of ${scssFiles.length} total files.`);

