#!/usr/bin/env node

/**
 * Safe replacement for `yarn up "*"`
 *
 * `yarn up` ignores npm: aliases and looks up the alias name itself, so
 * `"@typescript/native": "npm:typescript@..."` 404s (crashing the whole run) and
 * `"typescript": "npm:@typescript/typescript6@..."` gets silently replaced with
 * plain `typescript@latest`. This upgrades regular deps to latest, and re-resolves
 * aliased deps within their existing range so the alias (and its major) is kept.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

const regular = [];
const aliased = [];
for (const [name, spec] of Object.entries(deps)) {
    if (spec.startsWith('npm:')) aliased.push(`${name}@${spec}`);
    else regular.push(name);
}

const yarnUp = (args) => execFileSync('yarn', ['up', ...args], { stdio: 'inherit' });

if (regular.length) yarnUp(regular);
if (aliased.length) yarnUp(aliased);
