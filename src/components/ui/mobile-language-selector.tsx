"use client"

import { useI18n } from '@/hooks/useI18n'
import { Check } from 'lucide-react'

export function MobileLanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useI18n()
  
  return (
    <div className="space-y-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`w-full text-start px-3 py-2 rounded-sm flex items-center justify-between transition-colors ${
            currentLanguage === lang.code
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-gray-100'
          }`}
        >
          <span>{lang.nativeName}</span>
          {currentLanguage === lang.code && (
            <Check className="h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  )
}