#!/usr/bin/env node

/**
 * Consciousness Tracking System
 * Handles evening reflection responses and updates tracking.json
 * Called by main agent when processing Telegram callback/text responses
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = '/Users/noelgradisar/.openclaw/workspace/dispenza-prompts';
const TRACKING_FILE = path.join(WORKSPACE, 'memory/consciousness-tracking.json');

// Ensure memory directory exists
const memoryDir = path.join(WORKSPACE, 'memory');
if (!fs.existsSync(memoryDir)) {
  fs.mkdirSync(memoryDir, { recursive: true });
}

// Initialize tracking structure if it doesn't exist
function initTracking() {
  if (!fs.existsSync(TRACKING_FILE)) {
    const initial = {
      stats: {
        streak: 0,
        avgEmotion: null,
        avgGratitude: null,
        meditationRate: 0,
        totalDays: 0,
        lastEntry: null
      },
      days: []
    };
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(initial, null, 2));
  }
  return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf8'));
}

// Track a response
function trackResponse(date, field, value) {
  const data = initTracking();
  const today = date || new Date().toISOString().split('T')[0];
  
  // Find or create today's entry
  let dayEntry = data.days.find(d => d.date === today);
  if (!dayEntry) {
    dayEntry = {
      date: today,
      presence: null,
      emotion: null,
      gratitude: null,
      meditation: { times: null, duration: null },
      gratitudes: [],
      bestPrompt: null,
      insights: null
    };
    data.days.push(dayEntry);
  }
  
  // Update field
  if (field === 'presence') {
    dayEntry.presence = parseInt(value);
  } else if (field === 'emotion') {
    dayEntry.emotion = parseInt(value);
  } else if (field === 'gratitude') {
    dayEntry.gratitude = parseInt(value);
  } else if (field === 'meditation_times') {
    dayEntry.meditation.times = value;
  } else if (field === 'meditation_duration') {
    dayEntry.meditation.duration = value;
  } else if (field === 'gratitudes') {
    // Expecting array of strings
    dayEntry.gratitudes = Array.isArray(value) ? value : [value];
  } else if (field === 'bestPrompt') {
    dayEntry.bestPrompt = value;
  } else if (field === 'insights') {
    dayEntry.insights = value;
  }
  
  // Recalculate stats
  const completeDays = data.days.filter(d => d.emotion !== null);
  data.stats.totalDays = completeDays.length;
  
  if (completeDays.length > 0) {
    const emotions = completeDays.map(d => d.emotion).filter(e => e !== null);
    const gratitudes = completeDays.map(d => d.gratitude).filter(g => g !== null);
    
    data.stats.avgEmotion = (emotions.reduce((a, b) => a + b, 0) / emotions.length).toFixed(1);
    data.stats.avgGratitude = (gratitudes.reduce((a, b) => a + b, 0) / gratitudes.length).toFixed(1);
    
    // Calculate meditation rate
    const meditated = completeDays.filter(d => d.meditation.times && d.meditation.times !== '0x').length;
    data.stats.meditationRate = Math.round((meditated / completeDays.length) * 100);
    
    // Calculate streak
    data.stats.streak = calculateStreak(data.days);
    data.stats.lastEntry = today;
  }
  
  // Save
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
  console.log(`✓ Tracked: ${field} = ${JSON.stringify(value)}`);
  
  return data;
}

// Calculate current streak
function calculateStreak(days) {
  if (!days.length) return 0;
  
  const sortedDays = days
    .filter(d => d.emotion !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (!sortedDays.length) return 0;
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date(today);
  
  for (const day of sortedDays) {
    const dayDate = checkDate.toISOString().split('T')[0];
    if (day.date === dayDate) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

// Generate insight based on data
function generateInsight(data) {
  const recent = data.days.slice(-7); // Last 7 days
  
  if (recent.length < 3) {
    return "You're just getting started. Every check-in rewires your brain. Keep going. 💪";
  }
  
  const avgEmotion = recent
    .filter(d => d.emotion !== null)
    .reduce((sum, d) => sum + d.emotion, 0) / recent.filter(d => d.emotion !== null).length;
  
  const avgGratitude = recent
    .filter(d => d.gratitude !== null)
    .reduce((sum, d) => sum + d.gratitude, 0) / recent.filter(d => d.gratitude !== null).length;
  
  const meditationDays = recent.filter(d => d.meditation.times && d.meditation.times !== '0x').length;
  
  let insight = '';
  
  if (avgEmotion >= 8) {
    insight += '🌟 Your emotional state is elevated! This is where manifestation happens. ';
  } else if (avgEmotion < 5) {
    insight += '🌱 Your emotions need attention. More meditation, more gratitude, more movement. ';
  }
  
  if (avgGratitude >= 8) {
    insight += '🙏 You\'re in the state of receivership. The universe is responding. ';
  } else if (avgGratitude < 5) {
    insight += '💡 Gratitude is the bridge to abundance. Practice feeling it, even if forced at first. ';
  }
  
  if (meditationDays >= 5) {
    insight += '🧘 Your meditation consistency is building new neural pathways. You\'re literally rewiring your brain. ';
  } else if (meditationDays < 2) {
    insight += '⚡ More meditation = faster results. Make it non-negotiable. ';
  }
  
  if (data.stats.streak >= 7) {
    insight += `🔥 ${data.stats.streak}-day streak! This is momentum. Don't break it.`;
  }
  
  return insight.trim() || '💜 Keep showing up. That\'s the whole game.';
}

// CLI interface
const command = process.argv[2];
const date = process.argv[3];
const field = process.argv[4];
const value = process.argv[5];

if (command === 'track') {
  if (!field || !value) {
    console.error('Usage: node track-response.js track [date] <field> <value>');
    process.exit(1);
  }
  const data = trackResponse(date, field, value);
  console.log('Current stats:', data.stats);
} else if (command === 'insight') {
  const data = initTracking();
  console.log(generateInsight(data));
} else if (command === 'summary') {
  const data = initTracking();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error('Usage: node track-response.js [track|insight|summary]');
  process.exit(1);
}

module.exports = { trackResponse, generateInsight, initTracking };
