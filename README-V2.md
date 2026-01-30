# 🧠 Dispenza Consciousness Dashboard v2

**Automated consciousness prompts, interactive tracking, and progress visualization**

---

## What's New in v2

### ✨ Major Improvements

1. **OpenClaw Cron Integration** - Replaced GitHub Actions with OpenClaw cron jobs for reliable, local scheduling
2. **Expanded Prompt Library** - 25+ prompts per time slot (100+ total) from:
   - Dr. Joe Dispenza (quantum field, meditation, elevated emotions)
   - Neville Goddard (SATS, revision, feeling is the secret)
   - Bob Proctor (paradigms, vibration, wealth consciousness)
   - Vadim Zeland (Reality Transurfing, alternatives space)
   - Tony Robbins (state management, peak performance)
   - Abraham Hicks (alignment, allowing, vortex)
3. **Interactive Tracking** - Agent responds to evening reflections with personalized insights
4. **Enhanced Dashboard** - Better charts (trend lines, streaks, correlations), family presence tracking
5. **Strategic Voice Prompts** - Optional voice for high-impact moments (cost-controlled)
6. **Weekly Summaries** - Automated progress reports every Sunday

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   OpenClaw Cron Jobs                     │
│  (systemEvent - runs in background, no chat context)    │
└──────────────────┬──────────────────────────────────────┘
                   │
       ┌───────────┴───────────┬──────────────┬───────────┐
       │                       │              │           │
   ┌───▼────┐            ┌────▼─────┐   ┌───▼────┐  ┌──▼────┐
   │Hourly  │            │ Evening  │   │Morning │  │Weekly │
   │Prompts │            │   Form   │   │ Voice  │  │Summary│
   │9am-8pm │            │  7:30pm  │   │9:15am  │  │8pm Sun│
   └───┬────┘            └────┬─────┘   └───┬────┘  └──┬────┘
       │                      │              │          │
       └──────────┬───────────┴──────────────┴──────────┘
                  │
                  ▼
         Telegram (User: Klemen)
                  │
                  ▼
       ┌──────────────────────┐
       │   Main Agent         │
       │  (agentTurn)         │
       │  Handles responses   │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  Tracking System     │
       │  consciousness-      │
       │  tracking.json       │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │  Dashboard (Web)     │
       │  Real-time charts    │
       └──────────────────────┘
```

---

## Setup

### 1. Install Cron Jobs

The cron jobs are defined in `cron-jobs.json`. To install them in OpenClaw:

```bash
# Option A: Use OpenClaw's cron management interface
# Add each job from cron-jobs.json manually through the UI

# Option B: Or use OpenClaw CLI (if available)
openclaw cron install cron-jobs.json
```

**Cron Jobs:**
- **Hourly Prompts**: Every hour 9am-8pm (sends consciousness prompts)
- **Evening Form**: Daily at 7:30pm (sends reflection form)
- **Morning Voice** (optional): Daily at 9:15am (voice intention, costs ~$0.15/mo)
- **Evening SATS Voice** (optional): Daily at 9:45pm (voice SATS guide, costs ~$0.15/mo)
- **Weekly Summary**: Sunday at 8pm (progress summary)

### 2. Configure Environment Variables

Set these in your OpenClaw environment or `.env`:

```bash
TELEGRAM_BOT_TOKEN=7965077098:AAH_YrZ4fNYdOsJ5YfX_KKGx_uT9s3vz1PQ
TELEGRAM_CHAT_ID=1243017061
ELEVEN_LABS_API_KEY=your_key_here  # Optional - for voice prompts
```

### 3. Set Up Agent Response Handling

The main agent must handle evening reflection responses. Add logic to your agent's Telegram message handler:

```javascript
// See AGENT_INTEGRATION.md for complete implementation guide
```

Key points:
- Detect evening reflection responses (7:30pm-10pm window)
- Parse button callbacks (presence_X, emotion_X, etc.)
- Parse text responses (gratitudes, insights)
- Call tracking scripts to update data
- Respond with personalized insights

**Full integration guide:** See [`AGENT_INTEGRATION.md`](./AGENT_INTEGRATION.md)

### 4. Deploy Dashboard

The dashboard (`index-v2.html`) can be hosted on:

**Option A: GitHub Pages (Recommended)**
```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts
git add .
git commit -m "v2: Enhanced dashboard with agent integration"
git push origin main

# Enable GitHub Pages in repo settings → Pages → Source: main branch → root
# Dashboard will be live at: https://yourusername.github.io/dispenza-prompts/index-v2.html
```

**Option B: Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Option C: Local**
```bash
python3 -m http.server 8000
# Visit http://localhost:8000/index-v2.html
```

### 5. Test the System

```bash
# Test prompt delivery
node scripts/send-prompt.js

# Test evening form
node scripts/send-evening-form.js

# Test voice prompts (optional)
node scripts/send-voice-moment.js morning_intention
node scripts/send-voice-moment.js evening_sats

# Test tracking
node scripts/track-response.js track "2025-01-30" "emotion" "8"
node scripts/track-response.js insight

# Test weekly summary
node scripts/generate-weekly-summary.js
```

---

## How It Works

### Morning (9am-11am)
- **9:00am** - Hourly prompt (focus: intention setting, creating your day)
- **9:15am** - Optional voice prompt (morning intention)

### Midday (12pm-2pm)
- **Every hour** - Prompts focus on state management, mental rehearsal, catching limiting beliefs

### Afternoon (3pm-5pm)
- **Every hour** - Prompts focus on family, health, home vision, lifestyle

### Evening (6pm-8pm)
- **Every hour** - Prompts focus on gratitude, joy, SATS preparation
- **7:30pm** - Evening reflection form (8 questions)
- **9:45pm** - Optional voice SATS guide

### Sunday
- **8:00pm** - Weekly summary with metrics, insights, focus areas

---

## Prompt Library

### Time Slots
- **Morning (9-11am)**: 25 prompts - Intention, identity, morning meditation
- **Midday (12-2pm)**: 25 prompts - State checks, mental rehearsal, paradigm shifts
- **Afternoon (3-5pm)**: 25 prompts - Family presence, health, lifestyle visualization
- **Evening (6-8pm)**: 25 prompts - Gratitude, SATS prep, reflection

### Voice Moments (Optional)
- **Morning Intention** - 90-second guided intention setting
- **Evening SATS** - 120-second SATS (State Akin To Sleep) guide

All prompts in `prompts/library.json`

---

## Evening Reflection Form

**8 Questions sent at 7:30pm:**

1. How present were you with Melisa and Noel? (1-10)
2. Overall emotional state today? (1-10)
3. How easily could you feel gratitude? (1-10)
4. How many times did you meditate? (0x, 1x, 2x, 3x+)
5. Total meditation time? (≤20min, ≤40min, ≤1hr, 1hr+)
6. Reply with 3 gratitudes (text)
7. Which prompt hit hardest? (optional buttons)
8. Any wins/insights/breakthroughs? (text)

Responses are tracked in `memory/consciousness-tracking.json` and displayed on the dashboard.

---

## Dashboard Features

### Metrics Tracked
- **Streak** - Consecutive days of check-ins
- **Average Emotion** - 7-day rolling average
- **Average Gratitude Ease** - How easily you access gratitude
- **Meditation Rate** - % of days meditated
- **Family Presence** - How present with Melisa & Noel

### Visualizations
- **Emotional State Trend** - Line chart with trend analysis
- **Gratitude Ease** - Track gratitude capacity over time
- **Family Presence** - Quality time with loved ones
- **Meditation Tracking** - Bar chart of sessions per day
- **Recent Gratitudes** - Last 15 gratitudes displayed

### Insights
Real-time personalized insights based on:
- Recent emotional trends
- Gratitude patterns
- Meditation consistency
- Streak milestones

---

## Interactive Agent Responses

The main agent provides contextual feedback:

**High Scores (8-10)**
- "🌟 That elevated emotion is the key! You're in the quantum field."
- "🙏 Gratitude at 9/10 means you're in receivership mode. Watch what unfolds."

**Low Scores (1-4)**
- "🌱 Tomorrow, start with meditation. It resets everything."
- "💡 Gratitude can feel forced at first. Do it anyway. Neurons that fire together wire together."

**Milestones**
- "🔥 7-day streak! This is momentum. Don't break it."
- "✨ Meditated 5/7 days this week! You're building the neurological hardware."

**Future Gratitudes**
- "💰 Grateful for your million BEFORE you have it? That's collapsing the timeline."

See [`AGENT_INTEGRATION.md`](./AGENT_INTEGRATION.md) for full implementation details.

---

## Cost Breakdown

| Feature | Cost | Frequency | Monthly Cost |
|---------|------|-----------|--------------|
| Text prompts | Free | 12x/day | $0 |
| Evening form | Free | 1x/day | $0 |
| Voice prompts | $0.005 each | 2x/day (optional) | $0.30 |
| Tracking | Free | Continuous | $0 |
| Dashboard | Free | Hosted on GitHub | $0 |
| **Total (voice enabled)** | | | **$0.30** |
| **Total (text only)** | | | **$0** |

**Recommendation**: Start with text only ($0/mo). Enable morning voice after 1 week if desired.

---

## File Structure

```
dispenza-prompts/
├── prompts/
│   └── library.json              # 100+ prompts organized by time slot
├── scripts/
│   ├── send-prompt.js            # Hourly prompt delivery
│   ├── send-evening-form.js      # Evening reflection form
│   ├── send-voice-moment.js      # Voice prompts (optional)
│   ├── track-response.js         # Tracking system
│   └── generate-weekly-summary.js # Weekly progress report
├── memory/
│   └── consciousness-tracking.json # All tracking data
├── index-v2.html                 # Enhanced dashboard
├── cron-jobs.json                # Cron job definitions
├── AGENT_INTEGRATION.md          # Agent implementation guide
└── README-V2.md                  # This file
```

---

## Migration from v1

If you're coming from the GitHub Actions version:

1. **Disable GitHub Actions** - Go to repo → Actions → Disable workflows
2. **Install OpenClaw cron jobs** - See Setup section above
3. **Add agent response handling** - See AGENT_INTEGRATION.md
4. **Update dashboard URL** - Replace `index.html` with `index-v2.html`
5. **Test everything** - Run test commands above

Your existing tracking data will work with the new system (backward compatible).

---

## Troubleshooting

### Prompts not sending
```bash
# Check cron job status
openclaw cron list

# Check script execution
node scripts/send-prompt.js
# Should see: "✓ Prompt sent successfully"
```

### Dashboard not updating
```bash
# Check tracking file
cat memory/consciousness-tracking.json

# Verify GitHub Pages is enabled
# Repo → Settings → Pages → Source: main branch
```

### Voice prompts failing
```bash
# Check API key
echo $ELEVEN_LABS_API_KEY

# Test manually
node scripts/send-voice-moment.js morning_intention
# Should generate audio file in tmp/ and send to Telegram
```

### Agent not responding to reflections
- Check agent is running and connected to Telegram
- Verify AGENT_INTEGRATION.md implementation
- Check agent logs for errors
- Test with manual tracking: `node scripts/track-response.js track "2025-01-30" "emotion" "8"`

---

## Philosophy

This system is built on principles from:

**Dr. Joe Dispenza** - Elevated emotions, quantum field, meditation, breaking the habit of being yourself

**Neville Goddard** - SATS (State Akin To Sleep), feeling is the secret, revision, assumption creates reality

**Bob Proctor** - Paradigms, vibration, faith vs. fear, wealth consciousness

**Vadim Zeland** - Reality Transurfing, alternatives space, importance, outer intention

**Tony Robbins** - State management, peak performance, identity, incantations

**Abraham Hicks** - Alignment, allowing, vortex, segment intending

---

## Support

Questions? Issues? Improvements?

- **GitHub Issues**: Open an issue in the repo
- **Direct**: Message @gradisarklemen on Telegram
- **Agent**: Ask your OpenClaw agent for help

---

## License

MIT - Use freely, modify as needed, share if it helps others.

---

**Built with 💜 for consciousness evolution**

_"Where you place your attention is where you place your energy."_ — Dr. Joe Dispenza
