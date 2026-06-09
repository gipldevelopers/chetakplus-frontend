const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('f:/Software/laragon/www/chetak-plus/frontend/src');

files.forEach(file => {
  if (file.includes('utils.js')) return; 
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  const regex = /<img([^>]*?)src=\{([^}]+)\}([^>]*?)>/g;
  content = content.replace(regex, (match, before, srcVar, after) => {
    if (srcVar.includes('getImageUrl') || srcVar.includes('import.meta')) {
      return match;
    }
    return `<img${before}src={getImageUrl(${srcVar})}${after}>`;
  });
  
  const bgRegex = /backgroundImage:\s*`url\(\$\{([^}]+)\}\)`/g;
  content = content.replace(bgRegex, (match, bgVar) => {
    if (bgVar.includes('getImageUrl')) return match;
    return `backgroundImage: \`url(\${getImageUrl(${bgVar})})\``;
  });

  if (content !== original) {
    if (!content.includes('import { getImageUrl') && !content.includes('import { cn, getImageUrl')) {
      if (content.includes('import { cn } from "@/lib/utils"')) {
         content = content.replace('import { cn } from "@/lib/utils"', 'import { cn, getImageUrl } from "@/lib/utils"');
      } else if (content.includes("import { cn } from '@/lib/utils'")) {
         content = content.replace("import { cn } from '@/lib/utils'", "import { cn, getImageUrl } from '@/lib/utils'");
      } else {
         content = 'import { getImageUrl } from "@/lib/utils";\n' + content;
      }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
