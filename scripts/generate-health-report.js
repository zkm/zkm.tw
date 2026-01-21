#!/usr/bin/env node

/**
 * Generate Health Check Badge and Status Page
 * Creates a simple HTML page showing health check status
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BADGE_COLORS = {
  passed: '#4c1',
  warning: '#fe7d37',
  error: '#e05d44',
};

function generateBadge(status, passRate) {
  const color = status === 'HEALTHY' ? BADGE_COLORS.passed : 
                status === 'NEEDS ATTENTION' ? BADGE_COLORS.warning : 
                BADGE_COLORS.error;
  
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width="180" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h90v20H0z"/>
    <path fill="${color}" d="M90 0h90v20H90z"/>
    <path fill="url(#b)" d="M0 0h180v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="45" y="15" fill="#010101" fill-opacity=".3">Health Check</text>
    <text x="45" y="14">Health Check</text>
    <text x="135" y="15" fill="#010101" fill-opacity=".3">${passRate}%</text>
    <text x="135" y="14">${passRate}%</text>
  </g>
</svg>
  `.trim();
}

function generateStatusPage(report) {
  const { summary, checks } = report;
  const passRate = ((summary.passed / summary.total) * 100).toFixed(1);
  const status = summary.errors === 0 ? 
    (summary.warnings === 0 ? 'HEALTHY' : 'NEEDS ATTENTION') : 
    'UNHEALTHY';
  
  const statusColor = summary.errors === 0 ? 
    (summary.warnings === 0 ? '#4caf50' : '#ff9800') : 
    '#f44336';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Package Health Check Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .header .timestamp {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    .status-banner {
      background-color: ${statusColor};
      color: white;
      padding: 1.5rem;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem;
      background: #f5f5f5;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .summary-card .value {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 0.5rem 0;
    }
    .summary-card .label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .summary-card.passed .value { color: #4caf50; }
    .summary-card.warning .value { color: #ff9800; }
    .summary-card.error .value { color: #f44336; }
    .summary-card.total .value { color: #2196f3; }
    .checks {
      padding: 2rem;
    }
    .checks h2 {
      margin-bottom: 1.5rem;
      color: #333;
      border-bottom: 2px solid #667eea;
      padding-bottom: 0.5rem;
    }
    .check-item {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      background: #f9f9f9;
      transition: transform 0.2s;
    }
    .check-item:hover {
      transform: translateX(5px);
      background: #f0f0f0;
    }
    .check-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    .check-content {
      flex: 1;
    }
    .check-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }
    .check-message {
      color: #666;
      font-size: 0.9rem;
    }
    .check-item.passed { border-left: 4px solid #4caf50; }
    .check-item.warning { border-left: 4px solid #ff9800; }
    .check-item.error { border-left: 4px solid #f44336; }
    .footer {
      background: #333;
      color: white;
      text-align: center;
      padding: 1rem;
      font-size: 0.9rem;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 1rem;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: ${passRate}%;
      transition: width 0.3s ease;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏥 Package Health Check Report</h1>
      <div class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
    
    <div class="status-banner">
      ${status} - ${passRate}% Pass Rate
    </div>
    
    <div class="summary">
      <div class="summary-card total">
        <div class="label">Total Checks</div>
        <div class="value">${summary.total}</div>
      </div>
      <div class="summary-card passed">
        <div class="label">Passed</div>
        <div class="value">${summary.passed}</div>
      </div>
      <div class="summary-card warning">
        <div class="label">Warnings</div>
        <div class="value">${summary.warnings}</div>
      </div>
      <div class="summary-card error">
        <div class="label">Errors</div>
        <div class="value">${summary.errors}</div>
      </div>
    </div>
    
    <div class="checks">
      <h2>Detailed Check Results</h2>
      ${checks.map(check => `
        <div class="check-item ${check.status}">
          <div class="check-icon">
            ${check.status === 'passed' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'}
          </div>
          <div class="check-content">
            <div class="check-name">${check.name}</div>
            <div class="check-message">${check.details.message || check.status}</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      Generated by Package Health Check Scanner | zkm.tw
    </div>
  </div>
</body>
</html>
  `.trim();
}

function main() {
  const reportPath = join(process.cwd(), 'health-check-report.json');
  
  if (!existsSync(reportPath)) {
    console.error('❌ health-check-report.json not found. Run health check first.');
    process.exit(1);
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const { summary } = report;
  const passRate = ((summary.passed / summary.total) * 100).toFixed(1);
  const status = summary.errors === 0 ? 
    (summary.warnings === 0 ? 'HEALTHY' : 'NEEDS ATTENTION') : 
    'UNHEALTHY';

  // Generate badge
  const badge = generateBadge(status, passRate);
  const badgePath = join(process.cwd(), 'health-check-badge.svg');
  writeFileSync(badgePath, badge);
  console.log(`✅ Badge generated: ${badgePath}`);

  // Generate status page
  const statusPage = generateStatusPage(report);
  const statusPagePath = join(process.cwd(), 'health-check-report.html');
  writeFileSync(statusPagePath, statusPage);
  console.log(`✅ Status page generated: ${statusPagePath}`);
  
  console.log(`\n📊 Overall Status: ${status} (${passRate}% pass rate)`);
}

main();
