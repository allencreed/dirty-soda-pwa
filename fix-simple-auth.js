import fs from 'fs'

const replacements = [
  {
    path: 'src/pages/Cart.jsx',
    pattern: "Authorization: *** ',
    replacement: "Authorization: 'Bearer ' + (token || ''),",
  },
  {
    path: 'src/pages/Orders.jsx',
    pattern: "Authorization: *** ',
    replacement: "Authorization: 'Bearer ' + token",
  },
  {
    path: 'src/context/CartContext.jsx',
    pattern: "Authorization: *** ',
    replacement: "Authorization: 'Bearer ' + token",
  },
]

for (const r of replacements) {
  const text = fs.readFileSync(r.path, 'utf8')
  const count = (text.match(new RegExp(r.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  if (count === 0) {
    console.log('SKIP pattern not found in', r.path)
    continue
  }
  const updated = text.replace(new RegExp(r.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), r.replacement)
  fs.writeFileSync(r.path, updated, 'utf8')
  console.log('PATCHED', r.path, '- replaced', count, 'occurrence(s)')
}
