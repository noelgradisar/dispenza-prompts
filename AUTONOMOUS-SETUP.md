# 🤖 Autonomous Consciousness System

**Zero-cost, always-on manifestation system that runs independently of OpenClaw.**

## Why Autonomous?

**Problem with agent-based cron:**
- Burns API tokens every hour ($$$)
- Requires OpenClaw to be running 24/7
- Single point of failure

**Autonomous solution:**
- ✅ **$0 cost** - No API calls
- ✅ **Always works** - Runs independently via macOS LaunchAgents
- ✅ **Offline-first** - Works even when OpenClaw is down
- ✅ **Interactive when needed** - Mike (agent) responds only when you engage

---

## How It Works

### Automated (No Agent)
1. **Hourly prompts** (9am-8pm) → Telegram
2. **Evening form** (7:30pm) → Telegram  
3. **Weekly summary** (Sunday 8pm) → Telegram
4. **Tracking** → Updates `memory/consciousness-tracking.json`
5. **Dashboard** → Auto-updates from tracking data

### Interactive (With Agent)
- When you **click buttons** or **respond to forms**
- When you **ask for insights** ("How am I doing this week?")
- When you **request manual tracking** ("Track today's meditation")

---

## Installation

### 1. Install Autonomous System

```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts
./install-autonomous.sh
```

This installs 3 macOS LaunchAgents:
- `com.consciousness.hourly` - Prompts every hour (9am-8pm)
- `com.consciousness.evening` - Reflection form at 7:30pm
- `com.consciousness.weekly` - Summary on Sundays at 8pm

### 2. Verify Installation

```bash
# Check agents are loaded
launchctl list | grep consciousness

# Should see:
# -    0    com.consciousness.hourly
# -    0    com.consciousness.evening
# -    0    com.consciousness.weekly
```

### 3. Test Manually

```bash
# Send a prompt now
node scripts/send-prompt.js

# Send evening form now
node scripts/send-evening-form.js

# Generate weekly summary
node scripts/generate-weekly-summary.js
```

### 4. Monitor Logs

```bash
# Watch all logs
tail -f logs/*.log

# Just prompts
tail -f logs/hourly.log

# Just evening
tail -f logs/evening.log
```

---

## How Agent Interaction Works

### Scenario 1: Button Click (Evening Form)

**You**: *Click "emotion_8" in Telegram*

**System**: 
1. Telegram sends callback to OpenClaw
2. OpenClaw routes to main agent (Mike)
3. Mike runs: `node scripts/track-response.js track "2026-01-30" "emotion" "8"`
4. Mike responds: "🌟 Elevated emotion! You're in the field."

### Scenario 2: Manual Request

**You**: "Mike, how's my streak looking?"

**Mike**:
1. Reads `memory/consciousness-tracking.json`
2. Analyzes your data
3. Responds with insights

### Scenario 3: Automated (No Agent)

**System** (7:30pm):
1. LaunchAgent triggers → `scripts/send-evening-form.js` runs
2. Script sends questions to Telegram (no agent involved)
3. Zero API cost

---

## Cost Breakdown

| Component | Agent Cron | Autonomous | Savings |
|-----------|------------|------------|---------|
| Hourly prompts | $0.02/prompt × 12/day | $0 | $0.24/day |
| Evening form | $0.02/form | $0 | $0.02/day |
| Weekly summary | $0.02/summary | $0 | $0.01/day |
| **Monthly** | ~$8/month | **$0** | **$8/month** |

**Interactive responses** (when you engage): ~$0.01-0.05 per interaction

---

## File Structure

```
dispenza-prompts/
├── launchd/                          # macOS LaunchAgent configs
│   ├── com.consciousness.hourly.plist
│   ├── com.consciousness.evening.plist
│   └── com.consciousness.weekly.plist
├── scripts/                          # Autonomous scripts
│   ├── send-prompt.js               # Hourly prompts
│   ├── send-evening-form.js         # Evening reflection
│   ├── generate-weekly-summary.js   # Weekly report
│   └── track-response.js            # Tracking engine
├── memory/                          # Data storage
│   └── consciousness-tracking.json  # Your tracking data
├── logs/                            # System logs
│   ├── hourly.log
│   ├── evening.log
│   └── weekly.log
├── install-autonomous.sh            # Install script
├── uninstall-autonomous.sh          # Uninstall script
└── index-v2.html                    # Dashboard
```

---

## Troubleshooting

### "Prompts not sending"

```bash
# Check if agents are loaded
launchctl list | grep consciousness

# If not loaded, reinstall
./install-autonomous.sh
```

### "Wrong time zone"

LaunchAgents use system time. Make sure your Mac is set to Ljubljana timezone:
```
System Settings → General → Date & Time → Time Zone
```

### "Agent not responding to clicks"

That's fine! The autonomous system still works. But if you want interactive responses:
1. Make sure OpenClaw is running
2. Make sure you're connected via Telegram (pairing code worked)
3. Check OpenClaw logs for errors

### "Tracking not updating"

```bash
# Check tracking file exists
cat memory/consciousness-tracking.json

# Manually track something
node scripts/track-response.js track "2026-01-30" "emotion" "8"
```

---

## Uninstall

```bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts
./uninstall-autonomous.sh
```

This removes LaunchAgents but **preserves your tracking data** in `memory/`.

---

## Summary

✅ **Autonomous**: Runs without OpenClaw  
✅ **Cost-free**: $0 for automated prompts  
✅ **Interactive**: Agent responds when you engage  
✅ **Reliable**: Always-on via macOS LaunchAgents  
✅ **Simple**: Install once, forget about it  

**Your consciousness work continues, whether I'm online or not.** 🧠💜
