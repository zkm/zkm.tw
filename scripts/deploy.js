#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

function run(command, description, options = {}) {
    console.log(`🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit', ...options });
        console.log(`✅ ${description} complete`);
    } catch (_error) {
        // Throw rather than process.exit so deploy()'s finally block still cleans up.
        throw new Error(`${description} failed`);
    }
}

function hasStagedChanges(cwd) {
    try {
        execSync('git diff --cached --quiet', { stdio: 'ignore', cwd });
        return false;
    } catch {
        return true;
    }
}

function deploy() {
    console.log('🚀 Starting deployment process...');

    const distDir = resolve('dist');
    if (!existsSync(distDir)) {
        throw new Error('No dist folder found. Run "yarn build" first.');
    }

    // Work in a separate worktree so the developer's checkout (including gitignored files like
    // node_modules and workers/chat/.dev.vars) is never switched, wiped, or left half-deployed.
    const workDir = realpathSync(mkdtempSync(join(tmpdir(), 'zkm-production-')));
    let worktreeAdded = false;

    try {
        run('git fetch origin production', 'Fetching production branch');
        run(`git worktree add "${workDir}" production`, 'Checking out production worktree');
        worktreeAdded = true;

        // Fail before touching anything if local production has diverged from origin.
        run('git merge --ff-only origin/production', 'Fast-forwarding production', {
            cwd: workDir,
        });

        // Only tracked build output lives here, so wiping everything but .git is safe.
        run(
            'find . -maxdepth 1 -not -name ".git" -not -name "." -not -name ".." -exec rm -rf {} +',
            'Cleaning production branch',
            { cwd: workDir },
        );
        run(`cp -r "${distDir}"/. .`, 'Copying build files', { cwd: workDir });
        run('git add -A .', 'Staging files', { cwd: workDir });

        if (hasStagedChanges(workDir)) {
            run('git commit -m "Update production build for deployment"', 'Committing changes', {
                cwd: workDir,
            });
            run('git push origin production', 'Pushing to production', { cwd: workDir });
            console.log('🎉 Deployment complete!');
        } else {
            console.log('ℹ️ No changes to deploy. Production branch is already up to date.');
        }
    } finally {
        if (worktreeAdded) {
            execSync(`git worktree remove --force "${workDir}"`, { stdio: 'inherit' });
        }
        rmSync(workDir, { recursive: true, force: true });
    }
}

try {
    deploy();
} catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
}
