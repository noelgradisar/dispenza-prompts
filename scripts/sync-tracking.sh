#!/bin/bash
cd /Users/noelgradisar/.openclaw/workspace/dispenza-prompts
git add memory/consciousness-tracking.json
git commit -m "chore: Sync tracking $(date +%Y-%m-%d)" --quiet
git push origin main --quiet
