#!/usr/bin/env node

/**
 * Generate Weekly Summary
 * Analyzes last 7 days and sends comprehensive summary to Telegram
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/Users/noelgradisar/.openclaw/workspace/dispenza-prompts';
const TRACKING_FILE = path.join(WORKSPACE, 'memory/consciousness-tracking.json');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8142095199:AAGqE3GlP4xsWDpuGf_iesHyQTjzrzEmqX4';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1243017061';

if (!fs.existsSync(TRACKING_FILE)) {
  console.log('No tracking data yet');
  process.exit(0);
}

const data = JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
const today = new Date();
const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

const weekData = data.days.filter(d => {
  const date = new Date(d.date);
  return date >= sevenDaysAgo && date <= today;
});

if (weekData.length === 0) {
  console.log('Not enough data for weekly summary');
  process.exit(0);
}

// Calculate weekly metrics
const emotions = weekData.filter(d => d.emotion !== null).map(d => d.emotion);
const gratitudes = weekData.filter(d => d.gratitude !== null).map(d => d.gratitude);
const presences = weekData.filter(d => d.presence !== null).map(d => d.presence);
const meditatedDays = weekData.filter(d => d.meditation.times && d.meditation.times !== '0x').length;

const avgEmotion = emotions.length > 0 ? (emotions.reduce((a, b) => a + b, 0) / emotions.length).toFixed(1) : 'N/A';
const avgGratitude = gratitudes.length > 0 ? (gratitudes.reduce((a, b) => a + b, 0) / gratitudes.length).toFixed(1) : 'N/A';
const avgPresence = presences.length > 0 ? (presences.reduce((a, b) => a + b, 0) / presences.length).toFixed(1) : 'N/A';
const meditationRate = weekData.length > 0 ? Math.round((meditatedDays / weekData.length) * 100) : 0;

// Find emotional trend
const emotionTrend = emotions.length >= 3 
  ? (emotions.slice(-3).reduce((a, b) => a + b, 0) / 3) > (emotions.slice(0, 3).reduce((a, b) => a + b, 0) / 3)
    ? '📈 Rising'
    : emotions.slice(-3).reduce((a, b) => a + b, 0) / 3 < emotions.slice(0, 3).reduce((a, b) => a + b, 0) / 3
    ? '📉 Declining'
    : '➡️ Stable'
  : '➡️ Stable';

// Collect best insights
const insights = weekData
  .filter(d => d.insights)
  .map(d => `• ${d.insights.slice(0, 100)}${d.insights.length > 100 ? '...' : ''}`)
  .slice(-3)
  .join('\n');

// Generate summary message
const message = `
🌟 *WEEKLY CONSCIOUSNESS SUMMARY*

📅 *Week of ${sevenDaysAgo.toLocaleDateString('en-GB')} - ${today.toLocaleDateString('en-GB')}*

*📊 METRICS*
• Check-ins: ${weekData.length}/7 days
• Streak: ${data.stats.streak} days 🔥
• Avg Emotional State: ${avgEmotion}/10 ${emotionTrend}
• Avg Gratitude Ease: ${avgGratitude}/10
• Avg Family Presence: ${avgPresence}/10
• Meditation Rate: ${meditationRate}%

*🧘 MEDITATION*
Meditated ${meditatedDays} out of ${weekData.length} days
${meditationRate >= 70 ? '✨ Excellent consistency!' : meditationRate >= 50 ? '💪 Good progress!' : '⚡ Room for improvement!'}

${insights ? `*💡 KEY INSIGHTS*\n${insights}\n` : ''}
*🎯 FOCUS FOR NEXT WEEK*
${generateFocusAreas(avgEmotion, avgGratitude, avgPresence, meditationRate)}

*DISPENZA REMINDER:*
"Where you place your attention is where you place your energy. This week, you placed attention on your growth. That energy is compounding."

Keep going, Klemen. 💜
`;

// Send summary
fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: message.trim(),
    parse_mode: 'Markdown'
  })
})
  .then(res => res.json())
  .then(result => {
    if (result.ok) {
      console.log('✓ Weekly summary sent');
    } else {
      console.error('✗ Failed to send summary:', result);
    }
  })
  .catch(err => {
    console.error('✗ Error:', err);
  });

function generateFocusAreas(emotion, gratitude, presence, medRate) {
  const areas = [];
  
  if (emotion < 7) {
    areas.push('• Elevate your emotional state through movement, music, and visualization');
  }
  if (gratitude < 7) {
    areas.push('• Practice feeling gratitude even when it feels forced — neurons wire together');
  }
  if (presence < 7) {
    areas.push('• Be more present with Melisa and Noel — quality time creates quantum shifts');
  }
  if (medRate < 70) {
    areas.push('• Make meditation non-negotiable — this is where the magic happens');
  }
  
  if (areas.length === 0) {
    return '✨ You\'re crushing it! Keep this momentum. Consider deeper SATS practice and longer meditations.';
  }
  
  return areas.join('\n');
}
