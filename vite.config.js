import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// v6 item 23: every test's HAR as a file, so compare.sitespeed.io can open it
// by URL. That viewer fetches the HAR in the browser, so the file must allow
// other origins: GitHub Pages sends access-control-allow-origin: *, and the
// dev server here does the same. The build writes har/{test}.har beside the
// page. Dates in these files are the build's, since the mock's clock is the
// moment it loads (data.js NOW).
function harFiles() {
  const load = async () => {
    const { TESTS } = await import('./src/data.js')
    const { networkFor, toHar } = await import('./src/network-data.js')
    return TESTS.map(t => ({ t, log: networkFor(t.id) }))
      .filter(({ log }) => log.on && log.requests.length)
      .map(({ t, log }) => ({ fileName: `har/${t.id}.har`, source: JSON.stringify(toHar(t, log), null, 2) }))
  }
  return {
    name: 'har-files',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const id = req.url?.match(/^\/har\/(t-\d+)\.har(?:\?|$)/)?.[1]
        const file = id && (await load()).find(f => f.fileName === `har/${id}.har`)
        if (!file) return next()
        res.setHeader('content-type', 'application/json')
        res.setHeader('access-control-allow-origin', '*')
        res.end(file.source)
      })
    },
    async generateBundle() {
      for (const f of await load()) this.emitFile({ type: 'asset', ...f })
    },
  }
}

export default defineConfig({
  plugins: [react(), harFiles()],
  // Relative base so the build serves from https://rajat-lt.github.io/<repo>/.
  base: './',
  server: { port: 5181, strictPort: true },
})
