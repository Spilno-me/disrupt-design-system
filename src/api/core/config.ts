/**
 * API Simulation Configuration
 * Controls delays, error rates, and feature flags for realistic API behavior.
 */

export interface ApiConfig {
  /** Network delay simulation */
  delays: {
    /** Minimum delay in milliseconds */
    min: number
    /** Maximum delay in milliseconds */
    max: number
    /** Whether delays are enabled */
    enabled: boolean
  }
  /** Error simulation */
  errors: {
    /** Probability of random network failure (0-1) */
    networkFailureRate: number
    /** Whether error simulation is enabled */
    enabled: boolean
  }
  /** Pagination defaults */
  pagination: {
    /** Default page size */
    defaultPageSize: number
    /** Maximum page size */
    maxPageSize: number
  }
  /** Logging */
  logging: {
    /** Log API calls to console */
    enabled: boolean
    /** Include response data in logs */
    verbose: boolean
  }
}

/** Default configuration */
export const defaultApiConfig: ApiConfig = {
  delays: {
    min: 100,
    max: 500,
    enabled: true,
  },
  errors: {
    networkFailureRate: 0.02, // 2% random network failures
    enabled: true,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    verbose: false,
  },
}

/** Current configuration (mutable for runtime changes) */
let currentConfig: ApiConfig = { ...defaultApiConfig }

/**
 * Get current API configuration
 */
export function getApiConfig(): ApiConfig {
  return currentConfig
}

/**
 * Update API configuration
 * Useful for disabling delays/errors in tests or demos
 */
export function setApiConfig(config: Partial<ApiConfig>): void {
  currentConfig = {
    ...currentConfig,
    ...config,
    delays: { ...currentConfig.delays, ...config.delays },
    errors: { ...currentConfig.errors, ...config.errors },
    pagination: { ...currentConfig.pagination, ...config.pagination },
    logging: { ...currentConfig.logging, ...config.logging },
  }
}

/**
 * Reset configuration to defaults
 */
export function resetApiConfig(): void {
  currentConfig = { ...defaultApiConfig }
}

/**
 * Preset configurations for common scenarios
 */
export const apiConfigPresets = {
  /** Fast mode - no delays, no errors (for development) */
  fast: (): void => {
    setApiConfig({
      delays: { enabled: false, min: 0, max: 0 },
      errors: { enabled: false, networkFailureRate: 0 },
    })
  },
  /** Demo mode - minimal delays, no errors */
  demo: (): void => {
    setApiConfig({
      delays: { enabled: true, min: 50, max: 150 },
      errors: { enabled: false, networkFailureRate: 0 },
    })
  },
  /** Realistic mode - normal delays, occasional errors */
  realistic: (): void => {
    setApiConfig({
      delays: { enabled: true, min: 100, max: 500 },
      errors: { enabled: true, networkFailureRate: 0.02 },
    })
  },
  /** Stress test - high delays, frequent errors */
  stress: (): void => {
    setApiConfig({
      delays: { enabled: true, min: 500, max: 2000 },
      errors: { enabled: true, networkFailureRate: 0.1 },
    })
  },
}
