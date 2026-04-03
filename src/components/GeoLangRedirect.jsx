import { Navigate } from 'react-router-dom'
import { getPreferredLang } from '../i18n/translations'

/**
 * `/` → `/{lang}/…` using saved preference or default Indonesian (no geo/IP — instant).
 */
export default function GeoLangRedirect() {
  const lang = getPreferredLang()
  return <Navigate to={`/${lang}`} replace />
}
