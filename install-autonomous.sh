#!/bin/bash

# Install Autonomous Consciousness System
# Runs independently via macOS LaunchAgents (no OpenClaw/agent required)

set -e

WORKSPACE="/Users/noelgradisar/.openclaw/workspace/dispenza-prompts"
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

echo "🧠 Installing Autonomous Consciousness System..."
echo ""

# Create logs directory
mkdir -p "$WORKSPACE/logs"

# Copy launchd plists to LaunchAgents directory
echo "📝 Installing LaunchAgents..."
cp "$WORKSPACE/launchd/com.consciousness.hourly.plist" "$LAUNCH_AGENTS_DIR/"
cp "$WORKSPACE/launchd/com.consciousness.evening.plist" "$LAUNCH_AGENTS_DIR/"
cp "$WORKSPACE/launchd/com.consciousness.weekly.plist" "$LAUNCH_AGENTS_DIR/"

# Load the agents
echo "🚀 Loading agents..."
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.hourly.plist" 2>/dev/null || true
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.evening.plist" 2>/dev/null || true
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.weekly.plist" 2>/dev/null || true

launchctl load "$LAUNCH_AGENTS_DIR/com.consciousness.hourly.plist"
launchctl load "$LAUNCH_AGENTS_DIR/com.consciousness.evening.plist"
launchctl load "$LAUNCH_AGENTS_DIR/com.consciousness.weekly.plist"

echo ""
echo "✅ Autonomous system installed!"
echo ""
echo "📅 Schedule:"
echo "  • Hourly prompts: 9am-8pm daily"
echo "  • Evening form: 7:30pm daily"
echo "  • Weekly summary: Sunday 8pm"
echo ""
echo "💰 Cost: $0 (no API calls)"
echo "🔄 Runs independently (even when OpenClaw is offline)"
echo "📊 Dashboard: https://noelgradisar.github.io/dispenza-prompts/index-v2.html"
echo ""
echo "📝 Check status:"
echo "  launchctl list | grep consciousness"
echo ""
echo "📋 View logs:"
echo "  tail -f $WORKSPACE/logs/*.log"
echo ""
echo "🛑 To uninstall:"
echo "  ./uninstall-autonomous.sh"
