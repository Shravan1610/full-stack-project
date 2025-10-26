// Script to fix import paths in shared-ui package
const fs = require('fs');
const path = require('path');

const sharedUiPath = path.join(__dirname, 'packages/shared-ui/ui');

const fixes = [
  {
    file: 'carousel.tsx',
    find: "from '@/components/ui/button'",
    replace: "from './button'"
  },
  {
    file: 'form.tsx',
    find: "from '@/components/ui/label'",
    replace: "from './label'"
  },
  {
    file: 'toggle-group.tsx',
    find: "from '@/components/ui/toggle'",
    replace: "from './toggle'"
  },
  {
    file: 'command.tsx',
    find: "from '@/components/ui/dialog'",
    replace: "from './dialog'"
  },
  {
    file: 'calendar.tsx',
    find: "from '@/components/ui/button'",
    replace: "from './button'"
  },
  {
    file: 'pagination.tsx',
    find: "from '@/components/ui/button'",
    replace: "from './button'"
  },
  {
    file: 'alert-dialog.tsx',
    find: "from '@/components/ui/button'",
    replace: "from './button'"
  }
];

console.log('🔧 Fixing shared-ui import paths...\n');

fixes.forEach(({ file, find, replace }) => {
  const filePath = path.join(sharedUiPath, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes(find)) {
    content = content.replace(find, replace);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`ℹ️  ${file} - no changes needed`);
  }
});

console.log('\n✅ All imports fixed!');

