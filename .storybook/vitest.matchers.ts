/**
 * Jest-DOM matchers for Vitest
 *
 * This file is loaded ONLY by vitest (via vitest.config.ts setupFiles).
 * It's NOT imported by vitest.setup.ts to avoid bundling into Chromatic.
 *
 * The jest-dom/vitest import extends expect() with DOM matchers like:
 * - toBeVisible()
 * - toHaveTextContent()
 * - toBeInTheDocument()
 */
import '@testing-library/jest-dom/vitest'
