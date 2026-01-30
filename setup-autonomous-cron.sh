#!/bin/bash

# Setup Autonomous Consciousness System (No Agent Required)
# This runs prompts/forms independently via system cron

WORKSPACE="/Users/noelgradisar/.openclaw/workspace/dispenza-prompts"

echo "🧠 Setting up autonomous consciousness system..."
echo ""

# Export environment variables for cron
export TELEGRAM_BOT_TOKEN="8142095199:AAGqE3GlP4xsWDpuGf_iesHyQTjzrzEmqX4"
export TELEGRAM_CHAT_ID="1243017061"

# Create cron entries
cat > /tmp/consciousness-cron.txt << 'EOF'
# Consciousness Dashboard - Autonomous System
# Runs independently of OpenClaw agent

# Hourly prompts (9am-8pm Ljubljana time)
0 9-20 * * * cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts && /usr/local/bin/node scripts/send-prompt.js >> logs/prompts.log 2>&1

# Evening reflection form (7:30pm Ljubljana time)
30 19 * * * cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts && /usr/local/bin/node scripts/send-evening-form.js >> logs/evening.log 2>&1

# Weekly summary (Sunday 8pm Ljubljana time)
0 20 * * 0 cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts && /usr/local/bin/node scripts/generate-weekly-summary.js >> logs/weekly.log 2>&1
EOF

echo "📝 Cron entries created at /tmp/consciousness-cron.txt"
echo ""
echo "To install, run:"
echo "  crontab /tmp/consciousness-cron.txt"
echo ""
echo "Or add to existing crontab:"
echo "  crontab -l > /tmp/current-cron.txt"
echo "  cat /tmp/consciousness-cron.txt >> /tmp/current-cron.txt"
echo "  crontab /tmp/current-cron.txt"
echo ""
echo "⚠️  Note: macOS cron needs Full Disk Access permission"
echo "   Go to: System Settings → Privacy & Security → Full Disk Access → Add Terminal/iTerm"
echo ""
echo "✅ System will run independently (no OpenClaw/agent needed)"
echo "💰 Cost: $0 (no API calls)"
echo "🔄 Works even when agent is offline"
