'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { useState, useEffect } from 'react'

type TranslationObject = {
  [key: string]: string | TranslationObject
}

type Translations = {
  [locale: string]: TranslationObject
}

let cachedTranslations: Translations = {}

export function useTranslations(namespace?: string) {
  const { language } = useLanguage()
  const [translations, setTranslations] = useState<TranslationObject>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTranslations = async () => {
      if (cachedTranslations[language]) {
        setTranslations(cachedTranslations[language])
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/messages/${language}.json`)
        const data = await response.json()
        cachedTranslations[language] = data
        setTranslations(data)
      } catch (error) {
        console.error('Failed to load translations:', error)
        // Fallback to French if loading fails
        if (language !== 'fr') {
          try {
            const fallbackResponse = await fetch('/messages/fr.json')
            const fallbackData = await fallbackResponse.json()
            setTranslations(fallbackData)
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError)
          }
        }
      }
      setLoading(false)
    }

    loadTranslations()
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    if (loading || !translations || Object.keys(translations).length === 0) {
      return key // Return key while loading or if no translations
    }

    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation missing for key: ${key} in language: ${language}`)
        return key // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`)
      return key
    }

    // Replace parameters in the translation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return paramKey in params ? String(params[paramKey]) : match
      })
    }

    return value
  }

  return { t, loading, language }
}