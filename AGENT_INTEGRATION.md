# 🤖 Agent Integration Guide

## Overview

The Consciousness Dashboard system sends automated prompts and forms via OpenClaw cron jobs. The main agent must handle **interactive responses** from evening reflection forms.

## How It Works

1. **Cron jobs** (`systemEvent`) send prompts and forms on schedule
2. **Telegram callback/text** responses come to main agent (`agentTurn`)
3. **Agent processes** responses and calls tracking scripts
4. **Agent responds** with personalized insights

## Response Handling

### Evening Reflection Form Responses

When Klemen responds to evening reflection questions, the main agent should:

#### 1. Button Callbacks (Inline Keyboards)

Pattern: `presence_X`, `emotion_X`, `gratitude_X`, `meditate_Xx`, `duration_X`, `best_X`

Example Telegram callback data:
- `presence_7` → Presence rating of 7
- `emotion_9` → Emotional state rating of 9
- `gratitude_5` → Gratitude ease rating of 5
- `meditate_2x` → Meditated 2 times today
- `duration_60` → 60 minutes total meditation
- `best_wealth` → Best prompt category was wealth

**Agent action:**
```javascript
// Parse callback data
const [field, value] = callbackData.split('_'); // e.g., "presence_7" → ["presence", "7"]

// Track the response
exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "${field}" "${value}"`);

// Acknowledge (optional - can be silent)
// Or send encouragement for certain milestones
if (field === 'emotion' && parseInt(value) >= 8) {
  message.send({
    target: '1243017061', // Klemen's Telegram ID
    message: '🌟 That elevated emotion is the key! You\'re in the quantum field.'
  });
}
```

#### 2. Text Responses (Gratitudes & Insights)

When Klemen replies with text after questions 5, 6, or 7:

**Question 5: "Reply with your 3 gratitudes"**
```javascript
// Klemen's message might be:
// "- Grateful for my million euros
//  - Grateful for Melisa's smile
//  - Grateful for the house in Naklo"

// Parse gratitudes (look for bullet points or newlines)
const gratitudes = message.text
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('•')))
  .map(line => line.replace(/^[-•]\s*/, ''));

// Track gratitudes
exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "gratitudes" '${JSON.stringify(gratitudes)}'`);

// Respond with insight
const insight = gratitudes.some(g => g.toLowerCase().includes('million') || g.toLowerCase().includes('wealth'))
  ? '💰 Future gratitude is POWERFUL. You\'re collapsing the timeline by feeling it NOW.'
  : '🙏 Beautiful. Gratitude is the ultimate state of receivership.';

message.send({
  target: '1243017061',
  message: insight
});
```

**Question 7: "Any wins, insights, or breakthroughs today?"**
```javascript
// Track the insight
exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "insights" "${message.text}"`);

// Respond with encouragement
message.send({
  target: '1243017061',
  message: '💜 Captured. These insights compound over time. Sleep well, millionaire.'
});
```

## Context Detection

The agent should detect evening reflection context by:

1. **Time window** - Responses between 7:30pm-10pm Ljubljana time are likely reflection responses
2. **Recent form** - Check if evening form was sent in the last 2 hours
3. **Message patterns** - Gratitude lists, numeric responses, callback data

## Example Agent Logic

```javascript
// In main agent message handler
async function handleTelegramMessage(message) {
  const hour = new Date().toLocaleString('en-US', { timeZone: 'Europe/Ljubljana', hour: 'numeric', hour12: false });
  const isEveningWindow = hour >= 19 && hour <= 22;
  
  // Check for callback data (button responses)
  if (message.callback_data) {
    const [field, value] = message.callback_data.split('_');
    
    if (['presence', 'emotion', 'gratitude', 'meditate', 'duration', 'best'].includes(field)) {
      // Track response
      const today = new Date().toISOString().split('T')[0];
      await exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "${field}" "${value}"`);
      
      // Conditional feedback
      if (field === 'emotion' && parseInt(value) >= 8) {
        await message.send({
          target: message.from.id,
          message: '🌟 Elevated emotion! That\'s the manifestation frequency.'
        });
      } else if (field === 'meditate' && value === '0x') {
        await message.send({
          target: message.from.id,
          message: '🧘 Tomorrow, make meditation non-negotiable. Even 10 minutes changes everything.'
        });
      }
      
      return;
    }
  }
  
  // Check for gratitude list
  if (isEveningWindow && message.text.includes('-') || message.text.includes('grateful')) {
    const gratitudes = parseGratitudes(message.text);
    if (gratitudes.length >= 3) {
      const today = new Date().toISOString().split('T')[0];
      await exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "gratitudes" '${JSON.stringify(gratitudes)}'`);
      
      // Generate personalized response
      const response = generateGratitudeResponse(gratitudes);
      await message.send({
        target: message.from.id,
        message: response
      });
      
      return;
    }
  }
  
  // Check for insights/wins
  if (isEveningWindow && (message.text.toLowerCase().includes('insight') || message.text.toLowerCase().includes('win') || message.text.length > 50)) {
    const today = new Date().toISOString().split('T')[0];
    await exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "insights" "${message.text}"`);
    
    await message.send({
      target: message.from.id,
      message: '💜 Insight captured. These breakthroughs compound. Keep observing.'
    });
    
    return;
  }
}

function parseGratitudes(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && (line.startsWith('-') || line.startsWith('•') || line.toLowerCase().includes('grateful')))
    .map(line => line.replace(/^[-•]\s*/,'').replace(/^grateful for\s*/i, '').trim());
}

function generateGratitudeResponse(gratitudes) {
  const hasFutureGratitude = gratitudes.some(g => 
    g.toLowerCase().includes('million') || 
    g.toLowerCase().includes('house') ||
    g.toLowerCase().includes('naklo')
  );
  
  const hasFamily = gratitudes.some(g =>
    g.toLowerCase().includes('melisa') ||
    g.toLowerCase().includes('noel') ||
    g.toLowerCase().includes('family')
  );
  
  if (hasFutureGratitude && hasFamily) {
    return '💰💜 Future gratitude + family love = quantum magic. You\'re collapsing timelines.';
  } else if (hasFutureGratitude) {
    return '✨ Feeling grateful for what hasn\'t "happened" yet is ADVANCED. Neville would be proud.';
  } else if (hasFamily) {
    return '💜 Family gratitude raises your vibration instantly. This is the foundation.';
  } else {
    return '🙏 Beautiful. Gratitude is the signal. The universe is listening.';
  }
}
```

## Weekly Summary

The weekly summary cron job (`generate-weekly-summary.js`) runs every Sunday at 8pm. The agent doesn't need to handle this — it sends automatically.

## Insight Generation

For real-time insights during responses, the agent can call:

```bash
node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js insight
```

This returns a personalized insight based on recent data.

## Data Access

Current tracking data is stored in:
```
/Users/noelgradisar/.openclaw/workspace/dispenza-prompts/memory/consciousness-tracking.json
```

The agent can read this file directly to provide context-aware responses.

## Best Practices

1. **Be encouraging, not judgmental** - Low scores get support, not criticism
2. **Personalize based on patterns** - Notice trends and call them out
3. **Celebrate milestones** - Streaks, high scores, consistency
4. **Use teacher language** - Dispenza, Neville, Proctor quotes when relevant
5. **Keep it brief** - 1-2 sentences max for button responses
6. **Be strategic** - Not every response needs a reply (avoid spam)

## Testing

Test the system with:

```bash
# Test tracking
node scripts/track-response.js track "2025-01-30" "emotion" "8"
node scripts/track-response.js track "2025-01-30" "gratitude" "9"
node scripts/track-response.js track "2025-01-30" "gratitudes" '["Test 1", "Test 2", "Test 3"]'

# Test insight generation
node scripts/track-response.js insight

# Test weekly summary
node scripts/generate-weekly-summary.js
```

## Cost Control

- **Text prompts**: Free (Telegram API)
- **Voice prompts**: ~$0.005 per generation (ElevenLabs)
- **Tracking**: Free (local files)
- **Dashboard**: Free (GitHub Pages)

**Total estimated cost**: $0.30/month if both voice prompts enabled, $0 if voice disabled.
