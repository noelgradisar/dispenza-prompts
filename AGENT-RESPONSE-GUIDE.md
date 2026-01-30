# 🤖 Agent Response Guide

**How to handle Telegram responses from evening reflection form**

## Silent Tracking + Consolidated Feedback

### The Flow:

**User taps buttons:**
1. `presence_5` → Track silently
2. `emotion_7` → Track silently
3. `gratitude_8` → Track silently
4. `meditate_1x` → Track silently + **Now complete** → Send ONE consolidated response

**Only ONE message at the end, not after each tap.**

---

## Implementation (For Main Agent)

### When You Receive a Telegram Callback:

```javascript
// Extract field and value from callback_data
const [field, value] = message.callback_data.split('_');

// Check if it's a consciousness tracking callback
const trackingFields = ['presence', 'emotion', 'gratitude', 'meditate', 'duration', 'best'];

if (trackingFields.includes(field)) {
  const today = new Date().toISOString().split('T')[0];
  
  // Track SILENTLY
  const result = exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js track "${today}" "${field === 'meditate' ? 'meditation_times' : field}" "${value}" --silent`);
  
  // Check if entry is now complete
  const checkComplete = exec(`node /Users/noelgradisar/.openclaw/workspace/dispenza-prompts/scripts/track-response.js consolidated`);
  
  // If complete, send ONE consolidated insight
  if (checkComplete.includes('Today\'s Check-In Complete')) {
    message.send({
      target: message.from.id,
      message: checkComplete,
      parse_mode: 'Markdown'
    });
  }
  // Otherwise, do nothing (silent tracking)
}
```

### Pseudocode Flow:

```
IF callback_data matches tracking pattern:
  1. Run: track-response.js track <field> <value> --silent
  2. Check: Is entry complete? (presence + emotion + gratitude + meditation all filled)
  3. IF complete:
       - Run: track-response.js consolidated
       - Send result as ONE message
     ELSE:
       - Do nothing (silent)
```

---

## Example Scenario

### User Actions:
```
9:08 AM - User taps: presence_5
9:08 AM - User taps: emotion_7
9:08 AM - User taps: gratitude_8
9:08 AM - User taps: meditate_1x
```

### Agent Behavior:

**After tap 1 (presence_5):**
- ✓ Tracks presence = 5
- NO response

**After tap 2 (emotion_7):**
- ✓ Tracks emotion = 7
- NO response

**After tap 3 (gratitude_8):**
- ✓ Tracks gratitude = 8
- NO response

**After tap 4 (meditate_1x):**
- ✓ Tracks meditation = 1x
- ✓ Detects entry is COMPLETE
- ✓ Generates consolidated insight
- **✅ Sends ONE message:**

```
📊 **Today's Check-In Complete**

**Your Scores:**
💜 Presence: 5/10
😊 Emotion: 7/10
🙏 Gratitude: 8/10
🧘 Meditation: 1x

🔥 **1-day streak!** Build on this.

💪 **Solid baseline.** You're showing up. A few more elevated practices and you'll be in the manifestation zone.

**Presence reminder:** When with Melisa & Noel, BE THERE. They feel when you're fully present.

💜 Keep going. You're building the neural pathways.
```

---

## Command Reference

### Track Silently (No Feedback)
```bash
node scripts/track-response.js track "2026-01-30" "emotion" "8" --silent
# Output: ✓ emotion
```

### Track with Immediate Feedback (Old Way)
```bash
node scripts/track-response.js track "2026-01-30" "emotion" "8"
# Output: ✓ Tracked: emotion = "8"
#         Current stats: {...}
```

### Get Consolidated Insight (When Complete)
```bash
node scripts/track-response.js consolidated
# Output: Full consolidated message if entry is complete
```

### Get General Insight (7-day trends)
```bash
node scripts/track-response.js insight
# Output: Weekly insight based on recent patterns
```

---

## Benefits

✅ **Less noise** - One message instead of 4-5  
✅ **Better UX** - User can tap quickly without interruption  
✅ **Lower cost** - Fewer agent API calls  
✅ **More meaningful** - Consolidated feedback is more useful than individual responses  

---

## Edge Cases

### What if user taps buttons on different days?

The tracking system uses date stamps. Each day gets its own entry. Consolidated feedback only triggers when **today's** entry is complete.

### What if user taps the same button twice?

Last value wins. If they tap `emotion_5` then `emotion_8`, the final value is 8.

### What if user never completes the form?

Partial data is stored. No consolidated message is sent. User can complete it later (or tomorrow).

### What if user wants immediate feedback?

They can ask: "Mike, how's my tracking looking?" and you can read the file and respond.

---

## Integration Checklist

- [ ] Detect Telegram callbacks matching `presence_*`, `emotion_*`, `gratitude_*`, `meditate_*`
- [ ] Track silently using `--silent` flag
- [ ] Check if entry is complete after each track
- [ ] Send consolidated insight only when complete
- [ ] Handle text responses (gratitudes, insights) separately
- [ ] Update MEMORY.md to document this pattern

---

**Remember: Silence until complete. One powerful message beats four weak ones.** 💜
