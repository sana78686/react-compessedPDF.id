import { CMS_API_BASE } from '../config/cms'

/**
 * Turn CMS-relative media paths (e.g. /storage/...) into absolute URLs on the Laravel host.
 * Root-relative frontend assets (e.g. /logos/...) stay on the current site origin.
 */
export function resolveCmsMediaUrl(url) {
  if (url == null || url === '') return ''
  const s = String(url).trim()
  if (/^https?:\/\//i.test(s) || s.startsWith('//')) return s
  const path = s.startsWith('/') ? s : `/${s}`
  if (path.startsWith('/storage/') || path.startsWith('/media/')) {
    const base = String(CMS_API_BASE).replace(/\/$/, '')
    return `${base}${path}`
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`
  }
  return path
}

/**
 * Fix rich-text HTML that points img src (and similar) at /storage or /media on the CMS.
 */
export function absolutizeCmsHtml(html) {
  if (!html || typeof html !== 'string') return html
  const base = String(CMS_API_BASE).replace(/\/$/, '')
  return html.replace(
    /\b(src|href)=(["'])(\/(?:storage|media)\/[^"']+)\2/gi,
    (_, attr, q, p) => `${attr}=${q}${base}${p}${q}`,
  )
}
