const fs = require('fs');

const paths = ['src/app/paper-trading/page.tsx', 'src/app/paper-trading/[id]/page.tsx'];

paths.forEach(p => {
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  fs.writeFileSync(p, c);
  console.log(p + ' fixed');
});
