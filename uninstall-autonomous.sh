#!/bin/bash

# Uninstall Autonomous Consciousness System

set -e

LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"

echo "🛑 Uninstalling Autonomous Consciousness System..."
echo ""

# Unload agents
echo "Stopping agents..."
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.hourly.plist" 2>/dev/null || true
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.evening.plist" 2>/dev/null || true
launchctl unload "$LAUNCH_AGENTS_DIR/com.consciousness.weekly.plist" 2>/dev/null || true

# Remove plists
echo "Removing plists..."
rm -f "$LAUNCH_AGENTS_DIR/com.consciousness.hourly.plist"
rm -f "$LAUNCH_AGENTS_DIR/com.consciousness.evening.plist"
rm -f "$LAUNCH_AGENTS_DIR/com.consciousness.weekly.plist"

echo ""
echo "✅ Autonomous system uninstalled."
echo ""
echo "Note: Tracking data and logs are preserved in the workspace."
