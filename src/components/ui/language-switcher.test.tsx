import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from './language-switcher'
import type { SupportedLanguage, LanguageInfo } from '@/i18n/types'

// Mock the useI18n hook
const mockSetLanguage = vi.fn()
const mockLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' }
]

const mockUseI18n = {
  currentLanguage: 'en' as SupportedLanguage,
  languages: mockLanguages,
  setLanguage: mockSetLanguage,
  isRTL: false,
  t: vi.fn()
}

vi.mock('@/hooks/useI18n', () => ({
  useI18n: () => mockUseI18n
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseI18n.currentLanguage = 'en'
    mockUseI18n.isRTL = false
  })

  it('should render with current language selected', () => {
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('English')
  })

  it('should open dropdown when clicked', () => {
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    // Should show all language options in dropdown
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(5)
    expect(screen.getByText('Español')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
    expect(screen.getByText('Italiano')).toBeInTheDocument()
    expect(screen.getByText('العربية')).toBeInTheDocument()
  })

  it('should call setLanguage when option selected', () => {
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    const frenchOption = screen.getByText('Français')
    fireEvent.click(frenchOption)
    
    expect(mockSetLanguage).toHaveBeenCalledWith('fr')
  })

  it('should display different language when currentLanguage changes', () => {
    mockUseI18n.currentLanguage = 'es'
    render(<LanguageSwitcher />)
    
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveTextContent('Español')
  })
})