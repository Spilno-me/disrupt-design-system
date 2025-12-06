export const API_CONFIG = {
  BASE_URL: import.meta.env.MODE === 'production'
    ? ''
    : 'http://localhost:3001',
  ENDPOINTS: {
    SEND_EMAIL: '/api/send-email'
  }
} as const;

export const UI_CONSTANTS = {
  HEADER_HEIGHT: 'h-16',
  CONTAINER_PADDING: 'px-6',
  HERO_PADDING: 'py-24',
  FORM_HEIGHT: 'h-9',
  TEXTAREA_MIN_HEIGHT: 'min-h-[104px]',
  ICON_SIZES: {
    SMALL: 'w-6 h-6',
    MEDIUM: 'w-14 h-14',
    LARGE: 'w-20 h-20'
  },
  TOAST_DURATION: 4000
} as const;

export const FORM_CONSTANTS = {
  FIELD_GAPS: {
    MOBILE: 'gap-6',
    DESKTOP: 'sm:gap-8'
  },
  INPUT_HEIGHTS: {
    MOBILE: 'h-12',
    DESKTOP: 'sm:h-9'
  },
  BUTTON_COLORS: {
    MOBILE_SUBMIT: '#10b981',
    DESKTOP_SUBMIT: '#2D3142'
  },
  TEXT_SIZES: {
    MOBILE: 'text-base',
    DESKTOP: 'sm:text-sm'
  },
  CHECKBOX_SIZES: {
    MOBILE: 'w-6 h-6',
    DESKTOP: 'sm:w-4 sm:h-4'
  }
} as const;

export const COMPANY_INFO = {
  NAME: 'Disrupt Inc.',
  FULL_NAME: 'Disrupt Software Inc.',
  EMAIL: 'contact@disruptinc.io',
  WEBSITE: 'disruptinc.io',
  COPYRIGHT_YEAR: '2025'
} as const;

export const NAVIGATION = {
  HOME: '/',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service'
} as const;

export const ANALYTICS = {
  GA4_MEASUREMENT_ID: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-G0GBZFQJZ2'
} as const;
