#!/usr/bin/env node

/**
 * Health Check Commands Helper
 * Shows available health check commands with descriptions
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function header(title) {
  console.log('\n' + '='.repeat(60));
  log(title, COLORS.bright + COLORS.cyan);
  console.log('='.repeat(60));
}

function command(cmd, description) {
  log(`  $ yarn ${cmd}`, COLORS.green);
  console.log(`    ${description}\n`);
}

header('🏥 Package Health Check Commands');

console.log('\n📋 Main Commands:\n');

command(
  'health',
  'Run comprehensive health check on all packages and dependencies.\n' +
    '    Checks: security, updates, duplicates, licenses, and more.',
);

command(
  'health:full',
  'Full health check + security audit + outdated package check.\n' +
    '    Most thorough scan - recommended before releases.',
);

command(
  'health:report',
  'Generate visual HTML report and SVG badge from last health check.\n' +
    '    Creates health-check-report.html for viewing in browser.',
);

console.log('\n🔍 Dependency Commands:\n');

command(
  'deps:audit',
  'Security audit for known vulnerabilities.\n' + '    Uses yarn npm audit to scan for CVEs.',
);

command(
  'deps:check',
  'Check for outdated packages.\n' + '    Shows available updates without installing them.',
);

command(
  'deps:minor',
  'Check for minor and patch updates only.\n' +
    '    Safer updates that maintain backward compatibility.',
);

command(
  'deps:apply',
  'Apply all available updates.\n' + '    Updates package.json and installs new versions.',
);

command(
  'deps:apply:minor',
  'Apply only minor and patch updates.\n' + '    Safer automated updates for CI/CD.',
);

command(
  'deps:interactive',
  'Interactive dependency update mode.\n' + '    Choose which packages to update manually.',
);

header('📊 Understanding Output');

console.log('\n Status Indicators:\n');
log('  ✓ PASSED', COLORS.green);
console.log('    Check completed successfully - no action needed.\n');

log('  ⚠ WARNING', COLORS.yellow);
console.log('    Issue detected but not critical - review recommended.\n');

log('  ✗ ERROR', COLORS.red);
console.log('    Critical issue found - must be fixed.\n');

header('📁 Generated Files');

console.log("\n After running health checks, you'll find:\n");

log('  health-check-report.json', COLORS.cyan);
console.log('    Detailed machine-readable report with all check results.\n');

log('  health-check-report.html', COLORS.cyan);
console.log('    Visual dashboard - open in browser for pretty view.\n');

log('  health-check-badge.svg', COLORS.cyan);
console.log('    Status badge showing pass rate and health status.\n');

header('🔄 Automation');

console.log('\n The health check runs automatically via GitHub Actions:\n');
log('  • On every push to main/develop', COLORS.blue);
log('  • On every pull request', COLORS.blue);
log('  • Weekly on Monday at 9:00 AM UTC', COLORS.blue);
log('  • Can be triggered manually from Actions tab', COLORS.blue);

header('🎯 Quick Examples');

console.log('\n Common workflows:\n');

log('  Before committing:', COLORS.magenta);
console.log('  $ yarn health\n');

log('  Before releasing:', COLORS.magenta);
console.log('  $ yarn health:full\n');

log('  View results visually:', COLORS.magenta);
console.log('  $ yarn health:report && open health-check-report.html\n');

log('  Fix security issues:', COLORS.magenta);
console.log('  $ yarn deps:audit\n  $ yarn up <vulnerable-package>\n');

log('  Update dependencies safely:', COLORS.magenta);
console.log('  $ yarn deps:interactive\n');

header('📚 Documentation');

console.log('\n For more information:\n');
log('  • docs/HEALTH-CHECK.md', COLORS.cyan);
console.log('    Complete documentation with all features\n');
log('  • docs/HEALTH-CHECK-QUICKSTART.md', COLORS.cyan);
console.log('    Quick reference guide\n');
log('  • docs/HEALTH-CHECK-IMPLEMENTATION.md', COLORS.cyan);
console.log('    Implementation details and customization\n');

header('💡 Tips');

console.log('\n  1. Run health checks regularly (weekly minimum)');
console.log("  2. Fix errors immediately - don't let them pile up");
console.log('  3. Review warnings during planning meetings');
console.log('  4. Keep dependencies updated for security');
console.log('  5. Check the HTML report for trends over time\n');

log('Run any command above to get started! 🚀\n', COLORS.bright + COLORS.green);
