const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const targets = [
  {
    file: path.join(repo, 'src/pages/Cart.jsx'),
    bad: "Authorization: *** ${token || ''}`,",
    good: "Authorization: 'Bearer ' + (token || ''),",
  },
  {
    file: path.join(repo, 'src/pages/Orders.jsx'),
    bad: "Authorization: *** ${token}` }",
    good: "Authorization: 'Bearer ' + token }",
  },
  {
    file: path.join(repo, 'src/context/CartContext.jsx'),
    bad: "Authorization: *** ${token}` }",
    good: "Authorization: 'Bearer ' + token }",
  },
];

for (const t of targets) {
  const text = fs.readFileSync(t.file, 'utf8');
  if (text.includes(t.bad)) {
    fs.writeFileSync(t.file, text.replace(t.bad, t.good));
    console.log('PATCHED', t.file);
  } else {
    console.log('SKIP', t.file);
  }
}
