#!/usr/bin/env node

/**
 * Send Voice Moment (Strategic - Max 2 per day)
 * Uses ElevenLabs TTS for high-impact moments
 */

const fs = require('fs');
const path = require('path');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7965077098:AAH_YrZ4fNYdOsJ5YfX_KKGx_uT9s3vz1PQ';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1243017061';
const WORKSPACE = '/Users/noelgradisar/.openclaw/workspace/dispenza-prompts';
const ELEVEN_LABS_KEY = process.env.ELEVEN_LABS_API_KEY;

const moment = process.argv[2]; // 'morning_intention' or 'evening_sats'

if (!moment || !['morning_intention', 'evening_sats'].includes(moment)) {
  console.error('Usage: node send-voice-moment.js [morning_intention|evening_sats]');
  process.exit(1);
}

if (!ELEVEN_LABS_KEY) {
  console.error('ELEVEN_LABS_API_KEY not set - falling back to text');
  sendTextFallback();
  process.exit(0);
}

// Load voice moment text
const library = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'prompts/library.json'), 'utf8'));
const text = library.voice_moments[moment];

console.log(`[${new Date().toISOString()}] Generating voice for: ${moment}`);

// Generate TTS via ElevenLabs
const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel - warm, clear voice
const outputPath = path.join(WORKSPACE, 'tmp', `${moment}.mp3`);

// Ensure tmp directory exists
if (!fs.existsSync(path.join(WORKSPACE, 'tmp'))) {
  fs.mkdirSync(path.join(WORKSPACE, 'tmp'));
}

fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  method: 'POST',
  headers: {
    'Accept': 'audio/mpeg',
    'Content-Type': 'application/json',
    'xi-api-key': ELEVEN_LABS_KEY
  },
  body: JSON.stringify({
    text: text,
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  })
})
  .then(res => res.arrayBuffer())
  .then(buffer => {
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log('✓ Audio generated:', outputPath);
    return sendVoice(outputPath);
  })
  .catch(err => {
    console.error('✗ TTS failed:', err);
    console.log('Falling back to text...');
    sendTextFallback();
  });

async function sendVoice(audioPath) {
  const FormData = require('form-data');
  const form = new FormData();
  
  form.append('chat_id', TELEGRAM_CHAT_ID);
  form.append('voice', fs.createReadStream(audioPath));
  form.append('caption', `🎧 ${moment === 'morning_intention' ? 'Morning Intention' : 'Evening SATS Practice'}`);

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVoice`, {
      method: 'POST',
      body: form
    });

    const data = await res.json();
    if (data.ok) {
      console.log('✓ Voice message sent successfully');
      // Cleanup
      fs.unlinkSync(audioPath);
    } else {
      console.error('✗ Failed to send voice:', data);
    }
  } catch (err) {
    console.error('✗ Network error:', err);
  }
}

function sendTextFallback() {
  const library = JSON.parse(fs.readFileSync(path.join(WORKSPACE, 'prompts/library.json'), 'utf8'));
  const text = library.voice_moments[moment];

  fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `🎧 *${moment === 'morning_intention' ? 'Morning Intention' : 'Evening SATS Practice'}*\n\n${text}`,
      parse_mode: 'Markdown'
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        console.log('✓ Text fallback sent');
      } else {
        console.error('✗ Failed:', data);
      }
    });
}
