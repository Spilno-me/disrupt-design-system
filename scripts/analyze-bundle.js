#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 *
 * This script provides bundle analysis for the design system.
 *
 * Setup:
 * 1. Install the visualizer plugin: pnpm add -D rollup-plugin-visualizer
 * 2. Run: node scripts/analyze-bundle.js
 *
 * The script will:
 * - Build the library with bundle analysis enabled
 * - Generate an HTML report at dist/stats.html
 * - Open the report in your default browser
 *
 * @module scripts/analyze-bundle
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const VISUALIZER_PACKAGE = 'rollup-plugin-visualizer';

function checkDependency() {
  try {
    require.resolve(VISUALIZER_PACKAGE);
    return true;
  } catch {
    return false;
  }
}

function main() {
  console.log('Bundle Analyzer for Disrupt Design System\n');

  if (!checkDependency()) {
    console.log(`Missing dependency: ${VISUALIZER_PACKAGE}`);
    console.log('\nTo install, run:');
    console.log(`  pnpm add -D ${VISUALIZER_PACKAGE}\n`);
    console.log('Then run this script again.');
    process.exit(1);
  }

  console.log('Building with bundle analysis...\n');

  try {
    execSync('ANALYZE=true pnpm build', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });

    const statsPath = path.resolve(__dirname, '../dist/stats.html');
    if (existsSync(statsPath)) {
      console.log('\nBundle analysis complete!');
      console.log(`Report generated at: ${statsPath}`);

      // Try to open in browser
      const platform = process.platform;
      const openCommand =
        platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';

      try {
        execSync(`${openCommand} ${statsPath}`, { stdio: 'ignore' });
      } catch {
        console.log('Could not open browser automatically. Please open the file manually.');
      }
    }
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

main();
