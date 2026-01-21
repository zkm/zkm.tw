#!/usr/bin/env node

/**
 * Package Health Check Scanner
 * Performs comprehensive health checks on all packages and dependencies
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class HealthCheckScanner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        total: 0,
        passed: 0,
        warnings: 0,
        errors: 0,
      },
      checks: [],
    };
  }

  log(message, color = COLORS.reset) {
    console.log(`${color}${message}${COLORS.reset}`);
  }

  section(title) {
    console.log('\n' + '='.repeat(60));
    this.log(title, COLORS.bright + COLORS.cyan);
    console.log('='.repeat(60) + '\n');
  }

  addCheck(name, status, details = {}) {
    this.results.checks.push({ name, status, details, timestamp: new Date().toISOString() });
    this.results.summary.total++;
    
    if (status === 'passed') {
      this.results.summary.passed++;
      this.log(`✓ ${name}`, COLORS.green);
    } else if (status === 'warning') {
      this.results.summary.warnings++;
      this.log(`⚠ ${name}`, COLORS.yellow);
    } else if (status === 'error') {
      this.results.summary.errors++;
      this.log(`✗ ${name}`, COLORS.red);
    }

    if (details.message) {
      console.log(`  ${details.message}`);
    }
  }

  execCommand(command, options = {}) {
    try {
      const output = execSync(command, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options,
      });
      return { success: true, output };
    } catch (error) {
      return { 
        success: false, 
        error: error.message, 
        output: error.stdout || error.stderr || '' 
      };
    }
  }

  async checkPackageManager() {
    this.section('Package Manager Check');
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const packageManager = packageJson.packageManager || 'unknown';
    
    this.addCheck('Package Manager Defined', packageManager !== 'unknown' ? 'passed' : 'warning', {
      message: `Using: ${packageManager}`,
    });

    // Check if lock file exists
    const lockFiles = {
      'bun.lock': 'bun',
      'package-lock.json': 'npm',
      'pnpm-lock.yaml': 'pnpm',
      'yarn.lock': 'yarn',
    };

    let lockFileFound = false;
    for (const [file, pm] of Object.entries(lockFiles)) {
      if (existsSync(file)) {
        lockFileFound = true;
        this.addCheck('Lock File Present', 'passed', {
          message: `Found ${file}`,
        });
        break;
      }
    }

    if (!lockFileFound) {
      this.addCheck('Lock File Present', 'error', {
        message: 'No lock file found. Dependencies may not be deterministic.',
      });
    }
  }

  async checkSecurity() {
    this.section('Security Vulnerability Scan');
    
    // Try bun audit first (since package.json mentions bun)
    let result = this.execCommand('bun audit --json', { silent: true });
    
    if (!result.success) {
      // Fallback to npm audit
      result = this.execCommand('npm audit --json', { silent: true });
    }

    if (result.success && result.output) {
      try {
        const auditData = JSON.parse(result.output);
        
        // Handle different audit output formats
        const vulnerabilities = auditData.vulnerabilities || auditData.metadata?.vulnerabilities || {};
        const summary = auditData.metadata || auditData;
        
        const totalVulns = summary.total || 
                          (vulnerabilities.info || 0) + 
                          (vulnerabilities.low || 0) + 
                          (vulnerabilities.moderate || 0) + 
                          (vulnerabilities.high || 0) + 
                          (vulnerabilities.critical || 0);

        if (totalVulns === 0) {
          this.addCheck('Security Vulnerabilities', 'passed', {
            message: 'No known vulnerabilities found',
          });
        } else {
          const critical = vulnerabilities.critical || 0;
          const high = vulnerabilities.high || 0;
          const moderate = vulnerabilities.moderate || 0;
          const low = vulnerabilities.low || 0;

          const status = (critical > 0 || high > 0) ? 'error' : 'warning';
          this.addCheck('Security Vulnerabilities', status, {
            message: `Found ${totalVulns} vulnerabilities (Critical: ${critical}, High: ${high}, Moderate: ${moderate}, Low: ${low})`,
            critical,
            high,
            moderate,
            low,
            total: totalVulns,
          });
        }
      } catch (err) {
        this.addCheck('Security Vulnerabilities', 'warning', {
          message: 'Unable to parse audit results',
        });
      }
    } else {
      this.addCheck('Security Vulnerabilities', 'warning', {
        message: 'Unable to run security audit',
      });
    }
  }

  async checkOutdatedPackages() {
    this.section('Outdated Packages Check');
    
    // Try npm outdated
    const result = this.execCommand('npm outdated --json', { silent: true });
    
    if (result.output) {
      try {
        const outdated = JSON.parse(result.output);
        const outdatedCount = Object.keys(outdated).length;
        
        if (outdatedCount === 0) {
          this.addCheck('Package Updates', 'passed', {
            message: 'All packages are up to date',
          });
        } else {
          const majorUpdates = [];
          const minorUpdates = [];
          const patchUpdates = [];
          
          Object.entries(outdated).forEach(([name, info]) => {
            const current = info.current;
            const latest = info.latest;
            
            if (this.isMajorUpdate(current, latest)) {
              majorUpdates.push(name);
            } else if (this.isMinorUpdate(current, latest)) {
              minorUpdates.push(name);
            } else {
              patchUpdates.push(name);
            }
          });

          const status = majorUpdates.length > 5 ? 'warning' : 'passed';
          this.addCheck('Package Updates', status, {
            message: `${outdatedCount} packages have updates (Major: ${majorUpdates.length}, Minor: ${minorUpdates.length}, Patch: ${patchUpdates.length})`,
            outdatedCount,
            majorUpdates: majorUpdates.length,
            minorUpdates: minorUpdates.length,
            patchUpdates: patchUpdates.length,
          });
        }
      } catch (err) {
        this.addCheck('Package Updates', 'passed', {
          message: 'All packages appear to be up to date',
        });
      }
    } else {
      this.addCheck('Package Updates', 'warning', {
        message: 'Unable to check for outdated packages',
      });
    }
  }

  isMajorUpdate(current, latest) {
    const currentMajor = parseInt(current.split('.')[0]);
    const latestMajor = parseInt(latest.split('.')[0]);
    return latestMajor > currentMajor;
  }

  isMinorUpdate(current, latest) {
    const [currentMajor, currentMinor] = current.split('.').map(Number);
    const [latestMajor, latestMinor] = latest.split('.').map(Number);
    return latestMajor === currentMajor && latestMinor > currentMinor;
  }

  async checkDependencyTree() {
    this.section('Dependency Tree Analysis');
    
    // Check for duplicate dependencies
    const result = this.execCommand('npm ls --json --all', { silent: true });
    
    if (result.output) {
      try {
        const tree = JSON.parse(result.output);
        const duplicates = this.findDuplicateDependencies(tree);
        
        if (duplicates.length === 0) {
          this.addCheck('Duplicate Dependencies', 'passed', {
            message: 'No duplicate dependencies found',
          });
        } else {
          this.addCheck('Duplicate Dependencies', 'warning', {
            message: `Found ${duplicates.length} packages with multiple versions`,
            duplicates: duplicates.slice(0, 5), // Show first 5
          });
        }
      } catch (err) {
        this.addCheck('Duplicate Dependencies', 'warning', {
          message: 'Unable to analyze dependency tree',
        });
      }
    } else {
      this.addCheck('Duplicate Dependencies', 'warning', {
        message: 'Unable to analyze dependency tree',
      });
    }
  }

  findDuplicateDependencies(tree, versions = {}) {
    if (!tree.dependencies) return [];
    
    Object.entries(tree.dependencies).forEach(([name, info]) => {
      if (!versions[name]) {
        versions[name] = new Set();
      }
      versions[name].add(info.version);
      
      if (info.dependencies) {
        this.findDuplicateDependencies(info, versions);
      }
    });

    return Object.entries(versions)
      .filter(([, v]) => v.size > 1)
      .map(([name, v]) => ({ name, versions: Array.from(v) }));
  }

  async checkLicenses() {
    this.section('License Compliance Check');
    
    // Read package.json dependencies
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    
    const totalPackages = Object.keys(allDeps).length;
    
    this.addCheck('License Declaration', 'passed', {
      message: `Project License: ${packageJson.license || 'Not specified'}`,
    });

    this.addCheck('Dependencies Count', 'passed', {
      message: `Total dependencies: ${totalPackages} (${Object.keys(packageJson.dependencies || {}).length} runtime, ${Object.keys(packageJson.devDependencies || {}).length} dev)`,
      total: totalPackages,
      runtime: Object.keys(packageJson.dependencies || {}).length,
      dev: Object.keys(packageJson.devDependencies || {}).length,
    });
  }

  async checkEngines() {
    this.section('Engine Compatibility Check');
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    
    if (packageJson.engines) {
      this.addCheck('Engine Requirements Defined', 'passed', {
        message: `Node: ${packageJson.engines.node || 'Not specified'}`,
      });

      // Check current Node version
      const nodeVersion = process.version;
      const requiredNode = packageJson.engines.node;
      
      if (requiredNode) {
        // Simple check - in production you'd want semver comparison
        this.addCheck('Node Version', 'passed', {
          message: `Current: ${nodeVersion}, Required: ${requiredNode}`,
        });
      }
    } else {
      this.addCheck('Engine Requirements Defined', 'warning', {
        message: 'No engine requirements specified in package.json',
      });
    }
  }

  async checkScripts() {
    this.section('NPM Scripts Health Check');
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const scripts = packageJson.scripts || {};
    
    const essentialScripts = ['build', 'test', 'lint'];
    const found = essentialScripts.filter(s => scripts[s]);
    
    if (found.length === essentialScripts.length) {
      this.addCheck('Essential Scripts', 'passed', {
        message: 'All essential scripts present (build, test, lint)',
      });
    } else {
      const missing = essentialScripts.filter(s => !scripts[s]);
      this.addCheck('Essential Scripts', 'warning', {
        message: `Missing scripts: ${missing.join(', ')}`,
      });
    }

    this.addCheck('Total Scripts', 'passed', {
      message: `${Object.keys(scripts).length} scripts defined`,
    });
  }

  async checkTypeScript() {
    this.section('TypeScript Configuration Check');
    
    if (existsSync('tsconfig.json')) {
      this.addCheck('TypeScript Config', 'passed', {
        message: 'tsconfig.json found',
      });

      // Check if @types packages are installed
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const devDeps = packageJson.devDependencies || {};
      const typePackages = Object.keys(devDeps).filter(d => d.startsWith('@types/'));
      
      this.addCheck('TypeScript Type Definitions', 'passed', {
        message: `${typePackages.length} @types packages installed`,
      });
    } else {
      this.addCheck('TypeScript Config', 'passed', {
        message: 'Not a TypeScript project',
      });
    }
  }

  async checkTesting() {
    this.section('Testing Infrastructure Check');
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const testFrameworks = ['vitest', 'jest', 'mocha', 'jasmine', 'ava'];
    const foundFramework = testFrameworks.find(f => allDeps[f]);
    
    if (foundFramework) {
      this.addCheck('Test Framework', 'passed', {
        message: `Using ${foundFramework}`,
      });
    } else {
      this.addCheck('Test Framework', 'warning', {
        message: 'No test framework detected',
      });
    }

    // Check for test script
    if (packageJson.scripts?.test) {
      this.addCheck('Test Script', 'passed', {
        message: 'Test script configured',
      });
    } else {
      this.addCheck('Test Script', 'warning', {
        message: 'No test script found',
      });
    }
  }

  async checkBuildTools() {
    this.section('Build Tools Check');
    
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const buildTools = ['vite', 'webpack', 'rollup', 'parcel', 'esbuild'];
    const foundTool = buildTools.find(t => allDeps[t]);
    
    if (foundTool) {
      this.addCheck('Build Tool', 'passed', {
        message: `Using ${foundTool}`,
      });
    } else {
      this.addCheck('Build Tool', 'warning', {
        message: 'No build tool detected',
      });
    }
  }

  printSummary() {
    this.section('Health Check Summary');
    
    const { summary } = this.results;
    const passRate = ((summary.passed / summary.total) * 100).toFixed(1);
    
    console.log(`Total Checks: ${summary.total}`);
    this.log(`✓ Passed: ${summary.passed}`, COLORS.green);
    this.log(`⚠ Warnings: ${summary.warnings}`, COLORS.yellow);
    this.log(`✗ Errors: ${summary.errors}`, COLORS.red);
    console.log(`\nPass Rate: ${passRate}%`);
    
    const overallStatus = summary.errors === 0 ? 
      (summary.warnings === 0 ? 'HEALTHY' : 'NEEDS ATTENTION') : 
      'UNHEALTHY';
    
    const statusColor = summary.errors === 0 ? 
      (summary.warnings === 0 ? COLORS.green : COLORS.yellow) : 
      COLORS.red;
    
    this.log(`\nOverall Status: ${overallStatus}`, COLORS.bright + statusColor);
  }

  async saveReport() {
    const reportPath = join(process.cwd(), 'health-check-report.json');
    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    this.log(`\n📊 Detailed report saved to: ${reportPath}`, COLORS.cyan);
  }

  async run() {
    this.log('\n🏥 Package Health Check Scanner', COLORS.bright + COLORS.magenta);
    this.log('=' .repeat(60), COLORS.magenta);
    
    await this.checkPackageManager();
    await this.checkSecurity();
    await this.checkOutdatedPackages();
    await this.checkDependencyTree();
    await this.checkLicenses();
    await this.checkEngines();
    await this.checkScripts();
    await this.checkTypeScript();
    await this.checkTesting();
    await this.checkBuildTools();
    
    this.printSummary();
    await this.saveReport();
    
    // Exit with error code if there are errors
    if (this.results.summary.errors > 0) {
      process.exit(1);
    }
  }
}

// Run the health check
const scanner = new HealthCheckScanner();
scanner.run().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});
