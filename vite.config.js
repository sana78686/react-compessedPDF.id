import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Inject modulepreload for entry script so browser starts loading it earlier (LCP) */
function modulepreloadPlugin() {
  return {
    name: 'modulepreload',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const match = html.match(/<script[^>]+type\s*=\s*["']module["'][^>]+src\s*=\s*["']([^"']+)["']/i)
        if (!match) return html
        const src = match[1].replace(/^\//, '')
        const link = `    <link rel="modulepreload" href="/${src}" />`
        return html.replace('</head>', `${link}\n  </head>`)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), modulepreloadPlugin()],
  server: {
    port: 5000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor'
            return 'vendor-misc'
          }
        },
      },
    },
  },
})
