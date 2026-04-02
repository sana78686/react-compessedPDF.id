import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n/useTranslation'
import { supportedLangs, langOptions } from '../i18n/translations'
import { langShortLabel } from '../i18n/langMeta'
import BrandLogo from './BrandLogo'
import LangFlag from './LangFlag'
import '../pages/HomePage.css'

/* Lazy-load footer for faster LCP */
const Footer = lazy(() => import('./Footer'))

/*
 * Header nav intentionally minimal: logo (home) + language only.
 * Previously: Compress PDF link, All tools mega menu, Login, tools grid icon.
 * Uncomment the block below to restore those controls.
 *
 * import { PORTAL_LOGIN_URL, PORTAL_DASHBOARD_URL } from '../config/portal'
 * import { ucWords } from '../utils/ucWords'
 * const MegaMenu = lazy(() => import('./MegaMenu'))
 * const PORTAL_SESSION_COOKIE = 'compressedpdf_portal_session'
 *
 * Inside component: mega menu state/refs/effects, portal cookie check, then:
 * <nav className="nav" aria-label="Main navigation">
 *   <a href={`/${lang}`}>{ucWords(t('nav.compress'))}</a>
 *   <div className="nav-mega-wrap" ref={megaMenuRef}> ... All tools button + MegaMenu panel ... </div>
 * </nav>
 * {isPortalLoggedIn ? <a href={PORTAL_DASHBOARD_URL}>...</a> : <a href={PORTAL_LOGIN_URL}>...</a>}
 * <a href={`/${lang}/tools`} className="icon-more-tools">...</a>
 */

export default function SiteLayout({ children }) {
  const { lang } = useParams()
  const location = useLocation()
  const pathname = location.pathname
  const t = useTranslation(lang)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const langDropdownRef = useRef(null)

  useEffect(() => {
    if (typeof document !== 'undefined' && lang) {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }
  }, [lang])

  useEffect(() => {
    function handleClickOutside(e) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false)
      }
    }
    if (langDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [langDropdownOpen])

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-inner header-inner--minimal">
          <BrandLogo href={`/${lang}`} ariaLabel={t('nav.home')} text={t('logoMark')} />
          <div className="header-actions">
            <div className="lang-dropdown" ref={langDropdownRef}>
              <button
                type="button"
                className="lang-dropdown-trigger"
                onClick={() => setLangDropdownOpen((open) => !open)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <span className="lang-dropdown-flag" aria-hidden>
                  <LangFlag lang={supportedLangs.includes(lang) ? lang : 'en'} width={22} />
                </span>
                <span className="lang-dropdown-label">{langShortLabel[lang] ?? lang?.toUpperCase() ?? 'EN'}</span>
                <span className="lang-dropdown-chevron" aria-hidden>▼</span>
              </button>
              {langDropdownOpen && (
                <ul className="lang-dropdown-menu" role="listbox">
                  {supportedLangs.map((l) => (
                    <li key={l} role="option" aria-selected={lang === l}>
                      <a
                        href={pathname.replace(new RegExp(`^/${lang}(/|$)`), `/${l}$1`)}
                        className={`lang-dropdown-item ${lang === l ? 'lang-dropdown-item--active' : ''}`}
                        onClick={() => setLangDropdownOpen(false)}
                      >
                        <span className="lang-dropdown-item-flag" aria-hidden>
                          <LangFlag lang={l} width={22} />
                        </span>
                        <span className="lang-dropdown-item-label">{langOptions[l]?.label ?? l.toUpperCase()}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="main cms-main" tabIndex="-1">
        {children}
      </main>

      <Suspense fallback={<div className="footer-placeholder" aria-hidden="true" />}>
        <Footer lang={lang} pathname={pathname} t={t} footerPages={[]} />
      </Suspense>
    </div>
  )
}
