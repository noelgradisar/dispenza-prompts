#!/usr/bin/env node

/**
 * Consciousness Tracking System
 * Handles evening reflection responses and updates tracking.json
 * Called by main agent when processing Telegram callback/text responses
 * 
 * SILENT MODE: Only tracks data, no immediate feedback (consolidated at end)
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
        avgPresence: null,
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
function trackResponse(date, field, value, silent = true) {
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
    const presences = completeDays.map(d => d.presence).filter(p => p !== null);
    
    data.stats.avgEmotion = emotions.length > 0 ? (emotions.reduce((a, b) => a + b, 0) / emotions.length).toFixed(1) : null;
    data.stats.avgGratitude = gratitudes.length > 0 ? (gratitudes.reduce((a, b) => a + b, 0) / gratitudes.length).toFixed(1) : null;
    data.stats.avgPresence = presences.length > 0 ? (presences.reduce((a, b) => a + b, 0) / presences.length).toFixed(1) : null;
    
    // Calculate meditation rate
    const meditated = completeDays.filter(d => d.meditation.times && d.meditation.times !== '0x').length;
    data.stats.meditationRate = Math.round((meditated / completeDays.length) * 100);
    
    // Calculate streak
    data.stats.streak = calculateStreak(data.days);
    data.stats.lastEntry = today;
  }
  
  // Save
  fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2));
  
  if (!silent) {
    console.log(`✓ Tracked: ${field} = ${JSON.stringify(value)}`);
    console.log('Current stats:', data.stats);
  }
  
  
  // Auto-sync to GitHub when entry is complete
  if (isEntryComplete(dayEntry) && !silent) {
    require("child_process").execSync("bash /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/sync-tracking.sh", { stdio: "ignore" });
  }
  return { data, dayEntry, isComplete: isEntryComplete(dayEntry) };
}

// Check if today's entry is complete
function isEntryComplete(dayEntry) {
  return dayEntry.presence !== null &&
         dayEntry.emotion !== null &&
         dayEntry.gratitude !== null &&
         dayEntry.meditation.times !== null;
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

// Generate consolidated insight for completed entry
function generateConsolidatedInsight(data, dayEntry) {
  const { presence, emotion, gratitude, meditation } = dayEntry;
  const { streak, avgEmotion, avgGratitude, avgPresence } = data.stats;
  
  let insight = `📊 **Today's Check-In Complete**\n\n`;
  
  // Show scores
  insight += `**Your Scores:**\n`;
  insight += `💜 Presence: ${presence}/10\n`;
  insight += `😊 Emotion: ${emotion}/10\n`;
  insight += `🙏 Gratitude: ${gratitude}/10\n`;
  insight += `🧘 Meditation: ${meditation.times}\n\n`;
  
  // Streak
  if (streak > 0) {
    insight += `🔥 **${streak}-day streak!** `;
    if (streak >= 7) insight += `This is serious momentum.\n\n`;
    else if (streak >= 3) insight += `Keep it going!\n\n`;
    else insight += `Build on this.\n\n`;
  } else {
    insight += `**Start your streak tomorrow!**\n\n`;
  }
  
  // Overall assessment
  const avgToday = ((presence + emotion + gratitude) / 3).toFixed(1);
  
  if (avgToday >= 8) {
    insight += `🌟 **Elevated state!** You're in the field where manifestation happens. This is the zone.\n\n`;
  } else if (avgToday >= 6) {
    insight += `💪 **Solid baseline.** You're showing up. A few more elevated practices and you'll be in the manifestation zone.\n\n`;
  } else {
    insight += `🌱 **Work to do.** Your scores show where energy needs to go: `;
    
    const low = [];
    if (presence < 6) low.push('presence');
    if (emotion < 6) low.push('emotion');
    if (gratitude < 6) low.push('gratitude');
    
    insight += low.join(', ') + `. Focus there tomorrow.\n\n`;
  }
  
  // Specific feedback
  if (emotion < 6) {
    insight += `**Emotion boost:** Music + movement + visualization. Tony Robbins: "Motion creates emotion."\n`;
  }
  if (gratitude < 6) {
    insight += `**Gratitude practice:** Feel it for things that HAVEN'T happened yet. Your brain doesn't know the difference.\n`;
  }
  if (presence < 6) {
    insight += `**Presence reminder:** When with Melisa & Noel, BE THERE. They feel when you're fully present.\n`;
  }
  if (meditation.times === '0x') {
    insight += `**Meditation:** Tomorrow, do at least one. That's where the rewiring happens.\n`;
  }
  
  insight += `\n💜 Keep going. You're building the neural pathways.`;
  
  return insight;
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
const silent = process.argv[6] === '--silent';

if (command === 'track') {
  if (!field || !value) {
    console.error('Usage: node track-response.js track [date] <field> <value> [--silent]');
    process.exit(1);
  }
  const result = trackResponse(date, field, value, silent);
  
  if (!silent) {
    console.log('Current stats:', result.data.stats);
    
    if (result.isComplete) {
      console.log('\n' + generateConsolidatedInsight(result.data, result.dayEntry));
    }
  } else {
    // Just print minimal confirmation
    console.log(`✓ ${field}`);
  }
} else if (command === 'insight') {
  const data = initTracking();
  console.log(generateInsight(data));
} else if (command === 'consolidated') {
  const data = initTracking();
  const today = new Date().toISOString().split('T')[0];
  const dayEntry = data.days.find(d => d.date === today);
  
  if (!dayEntry) {
    console.log('No entry for today yet.');
  } else if (!isEntryComplete(dayEntry)) {
    console.log('Today\'s entry is not complete yet.');
  } else {
    console.log(generateConsolidatedInsight(data, dayEntry));
  }
} else if (command === 'summary') {
  const data = initTracking();
  console.log(JSON.stringify(data, null, 2));
} else {
  console.error('Usage: node track-response.js [track|insight|consolidated|summary]');
  process.exit(1);
}

module.exports = { trackResponse, generateInsight, generateConsolidatedInsight, isEntryComplete, initTracking };
