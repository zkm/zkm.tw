#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

const BACKUP_DIR = '/tmp/zkm-dist-backup';

function run(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} complete`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
}

function deploy() {
  console.log('🚀 Starting deployment process...');

  // Backup dist folder
  if (existsSync('dist')) {
    run(`cp -r dist ${BACKUP_DIR}`, 'Backing up dist folder');
  } else {
    console.error('❌ No dist folder found. Run "yarn build" first.');
    process.exit(1);
  }

  try {
    // Switch to production branch and deploy
    run('git checkout production', 'Switching to production branch');
    run(
      'find . -maxdepth 1 -not -name ".git" -not -name "." -not -name ".." -exec rm -rf {} +',
      'Cleaning production branch',
    );
    run(`cp -r ${BACKUP_DIR}/* .`, 'Copying build files');
    run('git add .', 'Staging files');
    run('git commit -m "Update production build for deployment"', 'Committing changes');
    run('git push origin production', 'Pushing to production');

    console.log('🎉 Deployment complete!');
  } finally {
    // Cleanup and return to master
    if (existsSync(BACKUP_DIR)) {
      rmSync(BACKUP_DIR, { recursive: true, force: true });
    }
    run('git checkout master', 'Returning to master');
  }
}

deploy();
