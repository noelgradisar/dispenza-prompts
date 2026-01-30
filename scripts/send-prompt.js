#!/usr/bin/env node

/**
 * Send Consciousness Prompt via Telegram
 * Picks appropriate prompt based on time of day
 */

const fs = require('fs');
const path = require('path');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7965077098:AAH_YrZ4fNYdOsJ5YfX_KKGx_uT9s3vz1PQ';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1243017061';
const WORKSPACE = '/Users/noelgradisar/.openclaw/workspace/dispenza-prompts';

// Load prompt library
const library = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'prompts/library.json'), 'utf8'));

// Determine time slot
const now = new Date();
const hour = now.getHours();
const day = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));

let timeSlot;
if (hour >= 9 && hour <= 11) {
  timeSlot = 'morning';
} else if (hour >= 12 && hour <= 14) {
  timeSlot = 'midday';
} else if (hour >= 15 && hour <= 17) {
  timeSlot = 'afternoon';
} else if (hour >= 18 && hour <= 20) {
  timeSlot = 'evening';
} else {
  console.log('Outside active hours (9am-8pm)');
  process.exit(0);
}

// Pseudo-random selection (deterministic per day+hour)
const prompts = library[timeSlot];
const seed = day * 100 + hour;
const index = seed % prompts.length;
const prompt = prompts[index];

console.log(`[${now.toISOString()}] Sending ${timeSlot} prompt (${index + 1}/${prompts.length})`);

// Send via Telegram
fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: prompt,
    parse_mode: 'Markdown'
  })
})
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      console.log('✓ Prompt sent successfully');
    } else {
      console.error('✗ Failed to send:', data);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('✗ Network error:', err);
    process.exit(1);
  });
