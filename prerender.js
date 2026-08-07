import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Minimal browser shims so client-only libs can be imported during prerender.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  }
}

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
const { render } = await import('./dist/server/entry-server.js')


const routesToPrerender = fs
  .readdirSync(toAbsolute('src/pages'))
  .map((file) => {
    const name = file.replace(/\.tsx$/, '').toLowerCase()
    return name === 'index' ? '/' : `/${name}`
  })

;(async () => {
  for (const url of routesToPrerender) {
    const { html: appHtml, head } = render(url)

    // Drop the sitewide fallback tags the route overrides, so no duplicates ship.
    let base = template
    if (head.includes('<title')) base = base.replace(/\s*<title>[\s\S]*?<\/title>/, '')
    if (head.includes('name="description"'))
      base = base.replace(/\s*<meta name="description"[^>]*>/, '')
    if (head.includes('property="og:title"'))
      base = base.replace(/\s*<meta property="og:title"[^>]*>/, '')
    if (head.includes('property="og:description"'))
      base = base.replace(/\s*<meta property="og:description"[^>]*>/, '')
    if (head.includes('property="og:type"'))
      base = base.replace(/\s*<meta property="og:type"[^>]*>/, '')

    const html = base
      .replace('<!--app-head-->', head ?? '')
      .replace('<!--app-html-->', appHtml)


    const filePath = `dist${url === '/' ? '/index' : url}.html`
    fs.writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  }
})()
