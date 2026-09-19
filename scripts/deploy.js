#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function run(command, description) {
    console.log(`🔄 ${description}...`);
    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${description} complete`);
    } catch (_error) {
        // Throw rather than process.exit so deploy()'s finally block still restores the branch.
        throw new Error(`${description} failed`);
    }
}

function hasStagedChanges() {
    try {
        execSync('git diff --cached --quiet', { stdio: 'ignore' });
        return false;
    } catch {
        return true;
    }
}

function getCurrentBranch() {
    return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
}

function isWorkingTreeDirty() {
    return execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
}

function deploy() {
    console.log('🚀 Starting deployment process...');

    if (!existsSync('dist')) {
        throw new Error('No dist folder found. Run "yarn build" first.');
    }

    // Uncommitted changes would carry over on checkout and get committed to production.
    if (isWorkingTreeDirty()) {
        throw new Error('Working tree has uncommitted changes. Commit or stash them first.');
    }

    const originalBranch = getCurrentBranch();
    const backupDir = mkdtempSync(join(tmpdir(), 'zkm-dist-'));

    try {
        run(`cp -r dist/. "${backupDir}"`, 'Backing up dist folder');

        // Switch to production branch and deploy
        run('git checkout production', 'Switching to production branch');
        run(
            'find . -maxdepth 1 -not -name ".git" -not -name "." -not -name ".." -exec rm -rf {} +',
            'Cleaning production branch',
        );
        run(`cp -r "${backupDir}"/. .`, 'Copying build files');
        run('git add .', 'Staging files');

        if (hasStagedChanges()) {
            run('git commit -m "Update production build for deployment"', 'Committing changes');
            run('git push origin production', 'Pushing to production');
            console.log('🎉 Deployment complete!');
        } else {
            console.log('ℹ️ No changes to deploy. Production branch is already up to date.');
        }
    } finally {
        // Cleanup and return to the original working branch, even if a step above failed.
        rmSync(backupDir, { recursive: true, force: true });
        if (getCurrentBranch() !== originalBranch) {
            // Discard anything left over from a partial run so the checkout can't be blocked.
            execSync('git reset --hard', { stdio: 'inherit' });
            execSync('git clean -fd', { stdio: 'inherit' });
            run(`git checkout ${originalBranch}`, `Returning to ${originalBranch}`);
        }
    }
}

try {
    deploy();
} catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
}
