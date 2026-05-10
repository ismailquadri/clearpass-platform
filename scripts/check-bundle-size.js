#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '../dist');

// Bundle size limits (in bytes)
const BUDGETS = {
  'index.js': 200 * 1024, // 200KB
  'index.css': 50 * 1024, // 50KB
  'react-vendor': 150 * 1024, // 150KB (React + ReactDOM)
  'ui-vendor': 50 * 1024, // 50KB (UI libraries)
  default: 100 * 1024, // 100KB for other chunks
  // Analytics views are expected to be larger due to charting libraries
  'PartnerAnalyticsView': 500 * 1024, // 500KB for analytics with charts
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function checkBundleSizes() {
  const assetsPath = path.join(distPath, 'assets');

  if (!fs.existsSync(assetsPath)) {
    console.error('❌ dist/assets directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  const files = fs.readdirSync(assetsPath);
  let exceededBudget = false;

  console.log('\n📊 Bundle Size Check\n');

  for (const file of files) {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const size = stats.size;

    // Determine budget for this file
    let budget = BUDGETS.default;

    // Check specific file patterns
    if (file.startsWith('index-') && file.endsWith('.js')) {
      budget = BUDGETS['index.js'];
    } else if (file.startsWith('index-') && file.endsWith('.css')) {
      budget = BUDGETS['index.css'];
    } else if (file.startsWith('react-vendor')) {
      budget = BUDGETS['react-vendor'];
    } else if (file.startsWith('ui-vendor')) {
      budget = BUDGETS['ui-vendor'];
    }

    // Check for specific view names
    for (const [key, value] of Object.entries(BUDGETS)) {
      if (file.includes(key) && key !== 'index.js' && key !== 'index.css' && key !== 'default') {
        budget = value;
        break;
      }
    }

    const isOverBudget = size > budget;
    const status = isOverBudget ? '❌' : '✅';
    const percentage = ((size / budget) * 100).toFixed(1);

    console.log(
      `${status} ${file}: ${formatBytes(size)} (${percentage}% of budget ${formatBytes(budget)})`
    );

    if (isOverBudget) {
      exceededBudget = true;
    }
  }

  console.log();

  if (exceededBudget) {
    console.error('❌ Bundle size budget exceeded!');
    console.log('Run `npm run build:analyze` to analyze bundle composition.');
    process.exit(1);
  } else {
    console.log('✅ All bundles within budget limits!');
    process.exit(0);
  }
}

checkBundleSizes();