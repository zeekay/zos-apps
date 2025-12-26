#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const appsDir = join(rootDir, 'apps');
const docsDir = join(rootDir, 'docs');

const apps = {};

// Read all apps from apps directory
const appDirs = readdirSync(appsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const appName of appDirs) {
  const pkgPath = join(appsDir, appName, 'package.json');

  if (!existsSync(pkgPath)) {
    console.log(`Skipping ${appName}: no package.json`);
    continue;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const zos = pkg.zos || {};

  if (!zos.id) {
    console.log(`Skipping ${appName}: no zos.id in package.json`);
    continue;
  }

  const manifest = {
    identifier: zos.id,
    name: zos.name || pkg.name,
    version: pkg.version || '1.0.0',
    description: zos.description || pkg.description || '',
    author: pkg.author || 'Hanzo AI',
    category: zos.category || 'other',
    icon: zos.icon || '',
    permissions: zos.permissions || [],
    repository: `https://github.com/zeekay/zos-apps`,
    window: zos.window || {},
  };

  // CDN URL - use jsDelivr for GitHub releases
  const cdnUrl = `https://cdn.jsdelivr.net/gh/zeekay/zos-apps@main/apps/${appName}/dist/index.js`;

  apps[zos.id] = {
    name: manifest.name,
    version: manifest.version,
    cdn: cdnUrl,
    manifest,
  };

  console.log(`Added: ${zos.id} (${manifest.name})`);
}

const registry = {
  apps,
  updated: new Date().toISOString(),
  version: '1.0.0',
};

// Write to docs folder for GitHub Pages
writeFileSync(join(docsDir, 'apps.json'), JSON.stringify(registry, null, 2));
console.log(`\nRegistry written to docs/apps.json with ${Object.keys(apps).length} apps`);
