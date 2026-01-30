#!/usr/bin/env node

/**
 * Test Consciousness Dashboard System
 * Runs comprehensive tests on all components
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = '/Users/noelgradisar/.openclaw/workspace/dispenza-prompts';
const TESTS = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  TESTS.push({ name, fn });
}

function run() {
  console.log('🧪 Testing Consciousness Dashboard v2\n');
  
  for (const { name, fn } of TESTS) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name}`);
      console.error(`   ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! System is ready.');
  } else {
    console.log('\n⚠️  Some tests failed. Review errors above.');
    process.exit(1);
  }
}

// Tests

test('Prompt library exists and is valid JSON', () => {
  const file = path.join(WORKSPACE, 'prompts/library.json');
  if (!fs.existsSync(file)) throw new Error('library.json not found');
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.morning || !data.midday || !data.afternoon || !data.evening) {
    throw new Error('Missing time slot categories');
  }
  
  if (data.morning.length < 20) throw new Error('Not enough morning prompts');
  if (data.midday.length < 20) throw new Error('Not enough midday prompts');
  if (data.afternoon.length < 20) throw new Error('Not enough afternoon prompts');
  if (data.evening.length < 20) throw new Error('Not enough evening prompts');
  
  if (!data.voice_moments.morning_intention || !data.voice_moments.evening_sats) {
    throw new Error('Missing voice moments');
  }
});

test('All scripts are executable', () => {
  const scripts = [
    'send-prompt.js',
    'send-evening-form.js',
    'send-voice-moment.js',
    'track-response.js',
    'generate-weekly-summary.js'
  ];
  
  for (const script of scripts) {
    const file = path.join(WORKSPACE, 'scripts', script);
    if (!fs.existsSync(file)) throw new Error(`${script} not found`);
    
    const stats = fs.statSync(file);
    if (!(stats.mode & 0o111)) {
      throw new Error(`${script} not executable`);
    }
  }
});

test('Memory directory exists with tracking file', () => {
  const memoryDir = path.join(WORKSPACE, 'memory');
  if (!fs.existsSync(memoryDir)) throw new Error('memory/ directory not found');
  
  const trackingFile = path.join(memoryDir, 'consciousness-tracking.json');
  if (!fs.existsSync(trackingFile)) throw new Error('consciousness-tracking.json not found');
  
  const data = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
  if (!data.stats || !data.days) throw new Error('Invalid tracking structure');
});

test('Cron jobs configuration is valid', () => {
  const file = path.join(WORKSPACE, 'cron-jobs.json');
  if (!fs.existsSync(file)) throw new Error('cron-jobs.json not found');
  
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.jobs || !Array.isArray(data.jobs)) throw new Error('Invalid cron structure');
  
  const requiredJobs = [
    'consciousness-hourly-prompts',
    'consciousness-evening-form',
    'consciousness-weekly-summary'
  ];
  
  for (const jobName of requiredJobs) {
    if (!data.jobs.find(j => j.name === jobName)) {
      throw new Error(`Missing required job: ${jobName}`);
    }
  }
});

test('Dashboard HTML files exist', () => {
  const files = ['index.html', 'index-v2.html'];
  
  for (const file of files) {
    const filePath = path.join(WORKSPACE, file);
    if (!fs.existsSync(filePath)) throw new Error(`${file} not found`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('Consciousness Dashboard')) {
      throw new Error(`${file} invalid content`);
    }
  }
});

test('Documentation is complete', () => {
  const docs = [
    'README-V2.md',
    'AGENT_INTEGRATION.md',
    'QUICKSTART.md'
  ];
  
  for (const doc of docs) {
    const file = path.join(WORKSPACE, doc);
    if (!fs.existsSync(file)) throw new Error(`${doc} not found`);
    
    const stats = fs.statSync(file);
    if (stats.size < 1000) throw new Error(`${doc} too short`);
  }
});

test('Tracking script functional test', () => {
  const script = path.join(WORKSPACE, 'scripts/track-response.js');
  const today = new Date().toISOString().split('T')[0];
  
  // Test tracking
  execSync(`node "${script}" track "${today}" "emotion" "8"`, { encoding: 'utf8' });
  
  // Verify data saved
  const trackingFile = path.join(WORKSPACE, 'memory/consciousness-tracking.json');
  const data = JSON.parse(fs.readFileSync(trackingFile, 'utf8'));
  
  const todayEntry = data.days.find(d => d.date === today);
  if (!todayEntry) throw new Error('Today entry not created');
  if (todayEntry.emotion !== 8) throw new Error('Emotion value not saved correctly');
  
  // Test insight generation
  const insight = execSync(`node "${script}" insight`, { encoding: 'utf8' });
  if (!insight || insight.length < 10) throw new Error('Insight generation failed');
});

test('Environment variables check', () => {
  const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];
  const missing = [];
  
  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    console.warn(`   ⚠️  Missing env vars (non-fatal): ${missing.join(', ')}`);
  }
});

test('Node.js dependencies available', () => {
  try {
    require('fs');
    require('path');
  } catch (err) {
    throw new Error('Core Node.js modules not available');
  }
});

// Run all tests
run();
