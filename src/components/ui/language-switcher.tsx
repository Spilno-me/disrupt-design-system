import { useI18n } from '@/hooks/useI18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, languages } = useI18n()
  
  const currentLang = languages.find(lang => lang.code === currentLanguage)

  return (
    <div className="w-[120px]" data-element="language-switcher" data-testid="language-switcher">
      <Select value={currentLanguage} onValueChange={setLanguage}>
        <SelectTrigger className="text-sm border-border bg-transparent cursor-pointer">
          <SelectValue>
            {currentLang?.nativeName || 'Language'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent side="bottom" align="end">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}