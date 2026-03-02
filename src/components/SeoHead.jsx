import { useEffect } from 'react'

/**
 * Sets document title and meta tags for SEO (search + social).
 * Use ogType="article" for blog/article posts, "website" for pages and list views.
 * @param {{
 *   title?: string
 *   description?: string
 *   canonical?: string
 *   robots?: string
 *   ogTitle?: string
 *   ogDescription?: string
 *   ogImage?: string
 *   ogType?: 'website' | 'article'
 * }} props
 */
export function SeoHead({
  title = '',
  description = '',
  canonical = '',
  robots = 'index, follow',
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
}) {
  const siteTitle = title ? `${title} | Compress PDF` : 'Compress PDF'
  const ogTitleFinal = ogTitle ?? title
  const ogDescFinal = ogDescription ?? description

  useEffect(() => {
    document.title = siteTitle

    const setMeta = (name, content, isProperty = false) => {
      if (!content) return
      const attr = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('robots', robots)
    setMeta('og:title', ogTitleFinal, true)
    setMeta('og:description', ogDescFinal, true)
    setMeta('og:image', ogImage, true)
    setMeta('og:type', ogType, true)

    // Canonical: use prop or fall back to current URL (absolute) for SEO
    const canonicalHref = canonical || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '')
    let canonicalEl = document.querySelector('link[rel="canonical"]')
    if (canonicalHref) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.setAttribute('href', canonicalHref)
    } else if (canonicalEl) {
      canonicalEl.remove()
    }
  }, [siteTitle, description, robots, canonical, ogTitleFinal, ogDescFinal, ogImage, ogType])

  return null
}
