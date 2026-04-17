const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(dashboard)/ecosystem/page.tsx',
  'src/app/(dashboard)/delivery-partners/page.tsx',
  'src/app/(dashboard)/pricing/page.tsx',
  'src/app/(dashboard)/team/page.tsx',
  'src/app/(dashboard)/testimonials/page.tsx',
  'src/app/(dashboard)/subscriptions/page.tsx',
  'src/app/(dashboard)/vendor-onboarding/page.tsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/hasPermission\('[^']+'\)\s*&/g, 'true &');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${f}`);
  } else {
    console.log(`Not found: ${f}`);
  }
});
