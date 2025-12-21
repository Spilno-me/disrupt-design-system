/**
 * WCAG Contrast Ratio Validator
 *
 * Parses TSX/MDX files to find color combinations and validates
 * they meet WCAG 2.1 contrast requirements.
 *
 * Usage: node scripts/validate-contrast.js [path]
 * - No args: scans src/components and src/stories
 * - With path: scans specific file or directory
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================================================================
// COLOR TOKEN REGISTRY (from designTokens.ts)
// =============================================================================

const ABYSS = {
  50: '#E8E9EB', 100: '#D1D3D7', 200: '#A3A7AF', 300: '#757B87',
  400: '#474F5F', 500: '#2D3142', 600: '#252836', 700: '#1D1F2A',
  800: '#14161E', 900: '#0C0D12',
};

const DEEP_CURRENT = {
  50: '#E6F7FA', 100: '#CCEFF5', 200: '#99DFEB', 300: '#66CFE1',
  400: '#33BFD7', 500: '#08A4BD', 600: '#068397', 700: '#056271',
  800: '#03424B', 900: '#022125',
};

const DUSK_REEF = {
  50: '#EFEDF3', 100: '#DFDBE7', 200: '#BFB7CF', 300: '#9F93B7',
  400: '#7F6F9F', 500: '#5E4F7E', 600: '#4B3F65', 700: '#382F4C',
  800: '#262033', 900: '#13101A',
};

const CORAL = {
  50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5',
  400: '#F87171', 450: '#EF4444', 500: '#F70D1A', 600: '#DC2626',
  700: '#B91C1C', 800: '#991B1B', 900: '#7F1D1D',
};

const WAVE = {
  50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD',
  400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
  800: '#1E40AF', 900: '#1E3A8A',
};

const SUNRISE = {
  50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
  400: '#FBBF24', 500: '#EAB308', 600: '#CA8A04', 700: '#A16207',
  800: '#854D0E', 900: '#713F12',
};

const ORANGE = {
  50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74',
  400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C',
  800: '#9A3412', 900: '#7C2D12',
};

const HARBOR = {
  50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
  400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
  800: '#166534', 900: '#14532D',
};

const SLATE = {
  50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
  400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155',
  800: '#1E293B', 900: '#0F172A',
};

const LINEN = {
  50: '#F5FCFF', 100: '#EBF9FF', 200: '#D9F0FB', 300: '#B8DCF0',
  400: '#8CBDD8', 500: '#6199B8', 600: '#4A7A96', 700: '#365B71',
  800: '#243D4D', 900: '#132029',
};

const PRIMITIVES = {
  white: '#FFFFFF',
  black: '#000000',
  cream: '#FBFBF3',
  softLinen: '#EBF9FF',
};

// Token name to hex value map
const TOKEN_MAP = {
  // Primitives
  'PRIMITIVES.white': PRIMITIVES.white,
  'PRIMITIVES.black': PRIMITIVES.black,
  'PRIMITIVES.cream': PRIMITIVES.cream,
  'PRIMITIVES.softLinen': PRIMITIVES.softLinen,
  // ABYSS scale
  ...Object.fromEntries(Object.entries(ABYSS).map(([k, v]) => [`ABYSS[${k}]`, v])),
  // DEEP_CURRENT scale
  ...Object.fromEntries(Object.entries(DEEP_CURRENT).map(([k, v]) => [`DEEP_CURRENT[${k}]`, v])),
  // DUSK_REEF scale
  ...Object.fromEntries(Object.entries(DUSK_REEF).map(([k, v]) => [`DUSK_REEF[${k}]`, v])),
  // CORAL scale
  ...Object.fromEntries(Object.entries(CORAL).map(([k, v]) => [`CORAL[${k}]`, v])),
  // WAVE scale
  ...Object.fromEntries(Object.entries(WAVE).map(([k, v]) => [`WAVE[${k}]`, v])),
  // SUNRISE scale
  ...Object.fromEntries(Object.entries(SUNRISE).map(([k, v]) => [`SUNRISE[${k}]`, v])),
  // ORANGE scale
  ...Object.fromEntries(Object.entries(ORANGE).map(([k, v]) => [`ORANGE[${k}]`, v])),
  // HARBOR scale
  ...Object.fromEntries(Object.entries(HARBOR).map(([k, v]) => [`HARBOR[${k}]`, v])),
  // SLATE scale
  ...Object.fromEntries(Object.entries(SLATE).map(([k, v]) => [`SLATE[${k}]`, v])),
  // LINEN scale
  ...Object.fromEntries(Object.entries(LINEN).map(([k, v]) => [`LINEN[${k}]`, v])),
};

// =============================================================================
// WCAG CONTRAST CALCULATION
// =============================================================================

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * Returns ratio as X:1
 */
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  if (lum1 === null || lum2 === null) return null;

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine WCAG level based on ratio and text size
 */
function getWcagLevel(ratio, isLargeText = false) {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
    return 'FAIL';
  }
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'FAIL';
}

// =============================================================================
// COLOR EXTRACTION FROM FILES
// =============================================================================

/**
 * Parse a ternary expression and return both values
 * Returns { isTernary: true, trueValue: X, falseValue: Y } or { isTernary: false, value: X }
 */
function parseTernary(expr) {
  const ternaryMatch = expr.match(/^(.+?)\s*\?\s*(.+?)\s*:\s*(.+)$/);
  if (ternaryMatch) {
    return {
      isTernary: true,
      condition: ternaryMatch[1].trim(),
      trueValue: ternaryMatch[2].trim(),
      falseValue: ternaryMatch[3].trim(),
    };
  }
  return { isTernary: false, value: expr };
}

/**
 * Resolve a token reference to hex value
 */
function resolveToken(token) {
  // Direct hex value
  if (/^#[0-9A-Fa-f]{6}$/.test(token)) {
    return token;
  }

  // Token reference like ABYSS[500] or PRIMITIVES.white
  const normalized = token.trim();
  if (TOKEN_MAP[normalized]) {
    return TOKEN_MAP[normalized];
  }

  // Try without brackets notation conversion
  const bracketMatch = normalized.match(/(\w+)\[['"]?(\d+)['"]?\]/);
  if (bracketMatch) {
    const key = `${bracketMatch[1]}[${bracketMatch[2]}]`;
    if (TOKEN_MAP[key]) return TOKEN_MAP[key];
  }

  return null;
}

/**
 * Extract color pairs from inline styles
 * Looks for patterns like: color: ABYSS[500], background: PRIMITIVES.white
 * Handles ternary expressions by checking both states separately
 */
function extractColorPairs(content, filePath) {
  const pairs = [];

  // Pattern for style objects: { color: X, background: Y }
  const styleBlockRegex = /style\s*=\s*\{\s*\{([^}]+)\}\s*\}/g;
  let match;

  while ((match = styleBlockRegex.exec(content)) !== null) {
    const styleContent = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Extract color property
    const colorMatch = styleContent.match(/color\s*:\s*([^,}\n]+)/);
    // Extract background property
    const bgMatch = styleContent.match(/background(?:Color)?\s*:\s*([^,}\n]+)/);

    if (colorMatch && bgMatch) {
      const fgToken = colorMatch[1].trim().replace(/['"]/g, '');
      const bgToken = bgMatch[1].trim().replace(/['"]/g, '');

      // Parse for ternary expressions
      const fgParsed = parseTernary(fgToken);
      const bgParsed = parseTernary(bgToken);

      // If both are ternaries with same condition pattern, check both states
      if (fgParsed.isTernary && bgParsed.isTernary) {
        // Check TRUE state: fgTrueValue on bgTrueValue
        const fgTrueHex = resolveToken(fgParsed.trueValue);
        const bgTrueHex = resolveToken(bgParsed.trueValue);
        if (fgTrueHex && bgTrueHex) {
          pairs.push({
            foreground: { token: fgParsed.trueValue, hex: fgTrueHex },
            background: { token: bgParsed.trueValue, hex: bgTrueHex },
            line: lineNumber,
            context: `[ternary TRUE state] ${match[0].substring(0, 80)}`,
          });
        }

        // Check FALSE state: fgFalseValue on bgFalseValue
        const fgFalseHex = resolveToken(fgParsed.falseValue);
        const bgFalseHex = resolveToken(bgParsed.falseValue);
        if (fgFalseHex && bgFalseHex) {
          pairs.push({
            foreground: { token: fgParsed.falseValue, hex: fgFalseHex },
            background: { token: bgParsed.falseValue, hex: bgFalseHex },
            line: lineNumber,
            context: `[ternary FALSE state] ${match[0].substring(0, 80)}`,
          });
        }
      } else {
        // Standard case: resolve directly
        const fgHex = fgParsed.isTernary ? null : resolveToken(fgToken);
        const bgHex = bgParsed.isTernary ? null : resolveToken(bgToken);

        if (fgHex && bgHex) {
          pairs.push({
            foreground: { token: fgToken, hex: fgHex },
            background: { token: bgToken, hex: bgHex },
            line: lineNumber,
            context: match[0].substring(0, 100),
          });
        }
        // If one is ternary and one is not, skip - too complex to validate statically
      }
    }
  }

  // Pattern for className with bg- and text- classes
  const classNameRegex = /className\s*=\s*["'`]([^"'`]+)["'`]/g;
  while ((match = classNameRegex.exec(content)) !== null) {
    const classes = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Extract bg- and text- classes (Tailwind)
    const bgClass = classes.match(/bg-(\w+)(?:-(\d+))?/);
    const textClass = classes.match(/text-(\w+)(?:-(\d+))?/);

    // Skip - these are Tailwind semantic classes, harder to resolve
    // Could add Tailwind color resolution in future
  }

  return pairs;
}

/**
 * Extract color pairs from MDX specific patterns
 */
function extractMdxColorPairs(content, filePath) {
  const pairs = [];

  // Pattern for JSX style props in MDX
  const jsxStyleRegex = /<\w+[^>]*style\s*=\s*\{\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\s*\}/g;
  let match;

  while ((match = jsxStyleRegex.exec(content)) !== null) {
    const styleContent = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Look for color and background in style object
    const colorMatch = styleContent.match(/color\s*:\s*([^,}\n]+)/);
    const bgMatches = [
      styleContent.match(/background\s*:\s*([^,}\n]+)/),
      styleContent.match(/backgroundColor\s*:\s*([^,}\n]+)/),
    ].filter(Boolean);

    const bgMatch = bgMatches[0];

    if (colorMatch) {
      const fgToken = colorMatch[1].trim().replace(/['"]/g, '');
      const fgHex = resolveToken(fgToken);

      if (bgMatch) {
        const bgToken = bgMatch[1].trim().replace(/['"]/g, '');
        const bgHex = resolveToken(bgToken);

        if (fgHex && bgHex) {
          pairs.push({
            foreground: { token: fgToken, hex: fgHex },
            background: { token: bgToken, hex: bgHex },
            line: lineNumber,
            context: match[0].substring(0, 80) + '...',
          });
        }
      }
    }
  }

  return pairs;
}

// =============================================================================
// FILE SYSTEM UTILITIES
// =============================================================================

/**
 * Recursively find files with given extensions
 */
function findFiles(dir, extensions, files = []) {
  if (!existsSync(dir)) return files;

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (entry !== 'node_modules' && entry !== 'dist' && entry !== '.git') {
        findFiles(fullPath, extensions, files);
      }
    } else if (extensions.includes(extname(entry).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

// =============================================================================
// VALIDATION & REPORTING
// =============================================================================

/**
 * Validate color pairs and report issues
 */
function validateFile(filePath, rootDir) {
  const content = readFileSync(filePath, 'utf-8');
  const ext = extname(filePath).toLowerCase();
  const relativePath = relative(rootDir, filePath);

  let pairs = [];

  if (ext === '.tsx' || ext === '.ts' || ext === '.jsx' || ext === '.js') {
    pairs = extractColorPairs(content, filePath);
  } else if (ext === '.mdx' || ext === '.md') {
    pairs = extractMdxColorPairs(content, filePath);
  }

  const issues = [];
  const passes = [];

  for (const pair of pairs) {
    const ratio = getContrastRatio(pair.foreground.hex, pair.background.hex);
    if (ratio === null) continue;

    const level = getWcagLevel(ratio);
    const result = {
      file: relativePath,
      line: pair.line,
      foreground: pair.foreground,
      background: pair.background,
      ratio: ratio.toFixed(2),
      level,
      context: pair.context,
    };

    if (level === 'FAIL') {
      issues.push(result);
    } else {
      passes.push(result);
    }
  }

  return { issues, passes, pairsFound: pairs.length };
}

// =============================================================================
// CLI OUTPUT
// =============================================================================

const COLORS_CLI = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function printHeader(text) {
  console.log(`\n${COLORS_CLI.bold}${COLORS_CLI.cyan}═══ ${text} ═══${COLORS_CLI.reset}\n`);
}

function printIssue(issue) {
  console.log(`${COLORS_CLI.red}✗ FAIL${COLORS_CLI.reset} ${COLORS_CLI.gray}${issue.file}:${issue.line}${COLORS_CLI.reset}`);
  console.log(`  ${COLORS_CLI.yellow}Foreground:${COLORS_CLI.reset} ${issue.foreground.token} (${issue.foreground.hex})`);
  console.log(`  ${COLORS_CLI.yellow}Background:${COLORS_CLI.reset} ${issue.background.token} (${issue.background.hex})`);
  console.log(`  ${COLORS_CLI.yellow}Ratio:${COLORS_CLI.reset} ${issue.ratio}:1 ${COLORS_CLI.red}(needs 4.5:1 for AA)${COLORS_CLI.reset}`);
  console.log('');
}

function printPass(result) {
  const levelColor = result.level === 'AAA' ? COLORS_CLI.green : COLORS_CLI.yellow;
  console.log(`${COLORS_CLI.green}✓${COLORS_CLI.reset} ${COLORS_CLI.gray}${result.file}:${result.line}${COLORS_CLI.reset} ${levelColor}${result.level}${COLORS_CLI.reset} (${result.ratio}:1)`);
}

function printSummary(totalFiles, totalPairs, issues, passes) {
  printHeader('Summary');
  console.log(`Files scanned:  ${COLORS_CLI.cyan}${totalFiles}${COLORS_CLI.reset}`);
  console.log(`Color pairs:    ${COLORS_CLI.cyan}${totalPairs}${COLORS_CLI.reset}`);
  console.log(`${COLORS_CLI.green}Passing:${COLORS_CLI.reset}        ${passes.length}`);
  console.log(`${COLORS_CLI.red}Failing:${COLORS_CLI.reset}        ${issues.length}`);

  if (issues.length > 0) {
    console.log(`\n${COLORS_CLI.red}${COLORS_CLI.bold}Contrast validation failed!${COLORS_CLI.reset}`);
    console.log(`${COLORS_CLI.gray}Fix the issues above or use approved color combinations from .claude/color-matrix.json${COLORS_CLI.reset}\n`);

    // Agent instructions
    printHeader('Agent Instructions');
    console.log(`${COLORS_CLI.bold}ACTION REQUIRED:${COLORS_CLI.reset} Fix each failing contrast pair using these rules:\n`);
    console.log(`${COLORS_CLI.yellow}WCAG AA Minimums:${COLORS_CLI.reset}`);
    console.log(`  • Normal text: 4.5:1`);
    console.log(`  • Large text (18px+ or 14px bold): 3.0:1`);
    console.log(`  • Icons/UI elements: 3.0:1\n`);

    console.log(`${COLORS_CLI.yellow}Common Fixes:${COLORS_CLI.reset}`);
    console.log(`  ${COLORS_CLI.red}✗${COLORS_CLI.reset} white on DEEP_CURRENT[500] (2.98:1) → ${COLORS_CLI.green}Use DEEP_CURRENT[700] or darker${COLORS_CLI.reset}`);
    console.log(`  ${COLORS_CLI.red}✗${COLORS_CLI.reset} white on CORAL[500] (4.18:1)       → ${COLORS_CLI.green}Use CORAL[600] or CORAL[700]${COLORS_CLI.reset}`);
    console.log(`  ${COLORS_CLI.red}✗${COLORS_CLI.reset} white on DEEP_CURRENT[600] (4.47:1)→ ${COLORS_CLI.green}Use DEEP_CURRENT[700]${COLORS_CLI.reset}`);
    console.log(`  ${COLORS_CLI.red}✗${COLORS_CLI.reset} Light text on light bg             → ${COLORS_CLI.green}Use ABYSS[500]+ for text${COLORS_CLI.reset}\n`);

    console.log(`${COLORS_CLI.yellow}Procedure:${COLORS_CLI.reset}`);
    console.log(`  1. Read the file at the reported line number`);
    console.log(`  2. Find the style={{ color: X, background: Y }} pattern`);
    console.log(`  3. Replace the failing color with an approved combination`);
    console.log(`  4. Re-run: ${COLORS_CLI.cyan}npm run validate:contrast${COLORS_CLI.reset}\n`);

    return 1;
  }

  console.log(`\n${COLORS_CLI.green}${COLORS_CLI.bold}All contrast checks passed!${COLORS_CLI.reset}\n`);
  return 0;
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  const rawArgs = process.argv.slice(2);
  const rootDir = join(__dirname, '..');

  // Separate flags from paths
  const flags = rawArgs.filter(arg => arg.startsWith('--'));
  const pathArgs = rawArgs.filter(arg => !arg.startsWith('--'));
  const verbose = flags.includes('--verbose');

  let targetPaths = [];

  if (pathArgs.length > 0) {
    // Specific path provided
    targetPaths = pathArgs.map(arg => {
      const fullPath = arg.startsWith('/') ? arg : join(rootDir, arg);
      return fullPath;
    });
  } else {
    // Default: scan components and stories
    targetPaths = [
      join(rootDir, 'src', 'components'),
      join(rootDir, 'src', 'stories'),
    ];
  }

  printHeader('WCAG Contrast Validator');
  console.log(`${COLORS_CLI.gray}Scanning for color combinations...${COLORS_CLI.reset}\n`);

  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.mdx'];
  let allFiles = [];

  for (const targetPath of targetPaths) {
    if (!existsSync(targetPath)) {
      console.log(`${COLORS_CLI.yellow}Warning: Path not found: ${targetPath}${COLORS_CLI.reset}`);
      continue;
    }

    const stat = statSync(targetPath);
    if (stat.isDirectory()) {
      allFiles = allFiles.concat(findFiles(targetPath, extensions));
    } else if (extensions.includes(extname(targetPath).toLowerCase())) {
      allFiles.push(targetPath);
    }
  }

  if (allFiles.length === 0) {
    console.log(`${COLORS_CLI.yellow}No files found to scan.${COLORS_CLI.reset}`);
    return 0;
  }

  let allIssues = [];
  let allPasses = [];
  let totalPairs = 0;

  for (const file of allFiles) {
    const { issues, passes, pairsFound } = validateFile(file, rootDir);
    allIssues = allIssues.concat(issues);
    allPasses = allPasses.concat(passes);
    totalPairs += pairsFound;
  }

  // Print issues
  if (allIssues.length > 0) {
    printHeader('Contrast Issues');
    for (const issue of allIssues) {
      printIssue(issue);
    }
  }

  // Print passes (verbose mode)
  if (verbose && allPasses.length > 0) {
    printHeader('Passing Combinations');
    for (const result of allPasses) {
      printPass(result);
    }
  }

  return printSummary(allFiles.length, totalPairs, allIssues, allPasses);
}

process.exit(main());
