# 🚀 Quick Start Guide

Get the Consciousness Dashboard v2 running in 5 minutes.

## Prerequisites

- OpenClaw installed and running
- Telegram bot token and chat ID configured
- Node.js installed (for running scripts)

## Step-by-Step Setup

### 1. Test Scripts Work

```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts

# Test prompt sending
node scripts/send-prompt.js
# Should send a prompt to Telegram

# Test evening form
node scripts/send-evening-form.js
# Should send reflection questions

# Test tracking
node scripts/track-response.js track "2025-01-30" "emotion" "8"
node scripts/track-response.js insight
# Should show tracking confirmation
```

### 2. Install Cron Jobs

**Method A: Manual (OpenClaw UI)**

Go to your OpenClaw cron management interface and add:

1. **Hourly Prompts**
   - Name: `consciousness-hourly-prompts`
   - Schedule: `0 9-20 * * *`
   - Timezone: `Europe/Ljubljana`
   - Command: `node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/send-prompt.js`
   - Type: `systemEvent`

2. **Evening Form**
   - Name: `consciousness-evening-form`
   - Schedule: `30 19 * * *`
   - Timezone: `Europe/Ljubljana`
   - Command: `node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/send-evening-form.js`
   - Type: `systemEvent`

3. **Weekly Summary**
   - Name: `consciousness-weekly-summary`
   - Schedule: `0 20 * * 0`
   - Timezone: `Europe/Ljubljana`
   - Command: `node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/generate-weekly-summary.js`
   - Type: `systemEvent`

**Method B: CLI (if available)**

```bash
openclaw cron install cron-jobs.json
```

### 3. Set Environment Variables

Add to your OpenClaw environment or `~/.openclaw/.env`:

```bash
TELEGRAM_BOT_TOKEN=7965077098:AAH_YrZ4fNYdOsJ5YfX_KKGx_uT9s3vz1PQ
TELEGRAM_CHAT_ID=1243017061
```

For voice prompts (optional):
```bash
ELEVEN_LABS_API_KEY=your_api_key_here
```

### 4. Verify Cron Jobs Running

```bash
# Check cron status
openclaw cron list

# Or check logs
openclaw cron logs consciousness-hourly-prompts
```

### 5. Deploy Dashboard

**GitHub Pages (Recommended):**

```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts

# Commit all changes
git add .
git commit -m "v2: Enhanced consciousness dashboard"
git push origin main

# Enable GitHub Pages
# Go to: https://github.com/noelgradisar/dispenza-prompts/settings/pages
# Source: Deploy from a branch → main → root
# Save

# Dashboard will be live at:
# https://noelgradisar.github.io/dispenza-prompts/index-v2.html
```

**Local testing:**

```bash
python3 -m http.server 8000
# Visit: http://localhost:8000/index-v2.html
```

### 6. Configure Agent Response Handling

Add this to your main agent's message handling logic:

```javascript
// In main agent's Telegram handler
if (message.callback_data) {
  const [field, value] = message.callback_data.split('_');
  
  if (['presence', 'emotion', 'gratitude', 'meditate', 'duration', 'best'].includes(field)) {
    const today = new Date().toISOString().split('T')[0];
    exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "${field}" "${value}"`);
    
    // Optional: Send encouraging feedback
    if (field === 'emotion' && parseInt(value) >= 8) {
      message.send({ target: message.from.id, message: '🌟 Elevated emotion! You\'re in the field.' });
    }
  }
}
```

**For complete agent integration, see [`AGENT_INTEGRATION.md`](./AGENT_INTEGRATION.md)**

### 7. Wait for First Prompt

The system will send the first prompt at the next scheduled time:
- **9am-8pm**: Hourly prompts
- **7:30pm**: Evening reflection form
- **8pm Sunday**: Weekly summary

Or test immediately:
```bash
node scripts/send-prompt.js
```

---

## Expected Behavior

### Hourly Prompts (9am-8pm)
You'll receive one consciousness prompt per hour from teachers like Dispenza, Neville, Proctor, Zeland, etc.

### Evening Form (7:30pm)
8 questions sent with 2-second delays:
1. Family presence (buttons 1-10)
2. Emotional state (buttons 1-10)
3. Gratitude ease (buttons 1-10)
4. Meditation times (buttons 0x, 1x, 2x, 3x+)
5. Meditation duration (buttons)
6. 3 gratitudes (text reply)
7. Best prompt category (optional buttons)
8. Wins/insights (text reply)

### Agent Responses
When you click buttons or send text replies, the agent will:
- Track your data automatically
- Respond with personalized insights
- Celebrate milestones (streaks, high scores)
- Offer support on low days

### Weekly Summary (Sunday 8pm)
Comprehensive report with:
- Metrics (streak, averages, meditation rate)
- Emotional trends
- Key insights
- Focus areas for next week

---

## Troubleshooting

**"Command not found: node"**
```bash
# Install Node.js
brew install node
# Or download from https://nodejs.org
```

**"Module not found: form-data"**
```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts
npm install form-data
```

**"Prompts not sending"**
```bash
# Test manually
node scripts/send-prompt.js

# Check bot token
echo $TELEGRAM_BOT_TOKEN

# Verify cron job installed
openclaw cron list | grep consciousness
```

**"Dashboard not loading data"**
- Make sure GitHub Pages is enabled (Settings → Pages)
- Check tracking file exists: `ls memory/consciousness-tracking.json`
- Push latest changes: `git push origin main`
- Wait 1-2 minutes for GitHub Pages to rebuild

**"Agent not responding"**
- Verify agent integration code added (see AGENT_INTEGRATION.md)
- Check agent logs for errors
- Test tracking manually: `node scripts/track-response.js track "2025-01-30" "emotion" "8"`

---

## What's Next?

1. **Track for 7 days** - Build your baseline
2. **Review first weekly summary** - See patterns emerge
3. **Enable voice prompts** (optional) - Add morning intention or evening SATS
4. **Adjust prompts** - Edit `prompts/library.json` to personalize
5. **Share progress** - Export dashboard or discuss with agent

---

## Quick Reference

**Repo:** `/Users/noelgradisar/.openclaw/workspace/dispenza-prompts`

**Scripts:**
- `scripts/send-prompt.js` - Hourly prompts
- `scripts/send-evening-form.js` - Evening form
- `scripts/send-voice-moment.js [morning_intention|evening_sats]` - Voice
- `scripts/track-response.js [track|insight|summary]` - Tracking
- `scripts/generate-weekly-summary.js` - Weekly report

**Data:**
- `memory/consciousness-tracking.json` - All your tracking data
- `prompts/library.json` - 100+ prompts

**Dashboard:**
- Local: `index-v2.html`
- Live: `https://noelgradisar.github.io/dispenza-prompts/index-v2.html`

**Documentation:**
- `README-V2.md` - Full system documentation
- `AGENT_INTEGRATION.md` - Agent implementation guide
- `QUICKSTART.md` - This file

---

**Ready to create your reality? Let's go. 🚀**
