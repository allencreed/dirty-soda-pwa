import fs from 'fs'

const replacements = [
  {
    path: 'src/pages/Cart.jsx',
    old: [
      "        headers: {",
      "          'Content-Type': 'application/json',",
      "          Authorization: *** ${token || ''}`,",
      "        },",
    ].join('\n'),
    new: [
      "        headers: {",
      "          'Content-Type': 'application/json',",
      "          Authorization: 'Bearer ' + (token || ''),",
      "        },",
    ].join('\n'),
  },
  {
    path: 'src/pages/Orders.jsx',
    old: [
      "        const res = await fetch(`${API_BASE}/api/orders`, {",
      "          headers: { Authorization: *** ${token}` }",
      "        })",
    ].join('\n'),
    new: [
      "        const authHeader = 'Bearer ' + token",
      "        const res = await fetch(`${API_BASE}/api/orders`, {",
      "          headers: { Authorization: authHeader }",
      "        })",
    ].join('\n'),
  },
  {
    path: 'src/context/CartContext.jsx',
    old: "      fetch(`${API_BASE}/api/cart`, { headers: { Authorization: *** ${token}` } })",
    new: "      const authHeader = 'Bearer ' + token\n      fetch(`${API_BASE}/api/cart`, { headers: { Authorization: authHeader } })",
  },
  {
    path: 'src/context/CartContext.jsx',
    old: [
      "      await fetch(`${API_BASE}/api/cart`, {",
      "        method: 'PUT',",
      "        headers: { 'Content-Type': 'application/json', Authorization: *** ${token}` },",
      "        body: JSON.stringify({ items: next })",
      "      })",
    ].join('\n'),
    new: [
      "      const authHeader = 'Bearer ' + token",
      "      await fetch(`${API_BASE}/api/cart`, {",
      "        method: 'PUT',",
      "        headers: { 'Content-Type': 'application/json', Authorization: authHeader },",
      "        body: JSON.stringify({ items: next })",
      "      })",
    ].join('\n'),
  },
]

for (const r of replacements) {
  const text = fs.readFileSync(r.path, 'utf8')
  if (text.includes(r.old)) {
    fs.writeFileSync(r.path, text.replace(r.old, r.new))
    console.log('PATCHED', r.path)
  } else {
    console.log('SKIP pattern not found in', r.path)
  }
}
