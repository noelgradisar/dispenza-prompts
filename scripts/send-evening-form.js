#!/usr/bin/env node

/**
 * Send Evening Reflection Form via Telegram
 * Uses inline keyboards for interactive responses
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7965077098:AAH_YrZ4fNYdOsJ5YfX_KKGx_uT9s3vz1PQ';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1243017061';

const questions = [
  {
    text: '🌙 *Evening Reflection*\n\n*1. How present were you with Melisa and Noel today?*',
    buttons: [
      [
        { text: '1', callback_data: 'presence_1' },
        { text: '2', callback_data: 'presence_2' },
        { text: '3', callback_data: 'presence_3' },
        { text: '4', callback_data: 'presence_4' },
        { text: '5', callback_data: 'presence_5' }
      ],
      [
        { text: '6', callback_data: 'presence_6' },
        { text: '7', callback_data: 'presence_7' },
        { text: '8', callback_data: 'presence_8' },
        { text: '9', callback_data: 'presence_9' },
        { text: '10', callback_data: 'presence_10' }
      ]
    ]
  },
  {
    text: '*2. Overall emotional state today?*',
    buttons: [
      [
        { text: '1', callback_data: 'emotion_1' },
        { text: '2', callback_data: 'emotion_2' },
        { text: '3', callback_data: 'emotion_3' },
        { text: '4', callback_data: 'emotion_4' },
        { text: '5', callback_data: 'emotion_5' }
      ],
      [
        { text: '6', callback_data: 'emotion_6' },
        { text: '7', callback_data: 'emotion_7' },
        { text: '8', callback_data: 'emotion_8' },
        { text: '9', callback_data: 'emotion_9' },
        { text: '10', callback_data: 'emotion_10' }
      ]
    ]
  },
  {
    text: '*3. How easily could you feel gratitude today?*',
    buttons: [
      [
        { text: '1 😓', callback_data: 'gratitude_1' },
        { text: '2', callback_data: 'gratitude_2' },
        { text: '3', callback_data: 'gratitude_3' },
        { text: '4', callback_data: 'gratitude_4' },
        { text: '5', callback_data: 'gratitude_5' }
      ],
      [
        { text: '6', callback_data: 'gratitude_6' },
        { text: '7', callback_data: 'gratitude_7' },
        { text: '8', callback_data: 'gratitude_8' },
        { text: '9', callback_data: 'gratitude_9' },
        { text: '10 ✨', callback_data: 'gratitude_10' }
      ]
    ]
  },
  {
    text: '*4. How many times did you meditate today?*\n\n(Ideal: 2x per day 🧘)',
    buttons: [
      [
        { text: '❌ None', callback_data: 'meditate_0x' },
        { text: '1x', callback_data: 'meditate_1x' },
        { text: '✨ 2x', callback_data: 'meditate_2x' },
        { text: '3x+', callback_data: 'meditate_3x' }
      ]
    ]
  },
  {
    text: '*4b. Total meditation time today?*',
    buttons: [
      [
        { text: '≤20 min', callback_data: 'duration_20' },
        { text: '≤40 min', callback_data: 'duration_40' }
      ],
      [
        { text: '≤1 hour', callback_data: 'duration_60' },
        { text: '1h+ 🔥', callback_data: 'duration_60plus' }
      ]
    ]
  },
  {
    text: '*5. Reply with your 3 gratitudes* 🙏\n\n(Can be for things that haven\'t happened yet!)\n\nExample:\n- Grateful for my million euros\n- Grateful for Melisa\'s smile\n- Grateful for the house in Naklo',
    buttons: null
  },
  {
    text: '*6. Which prompt hit hardest today?*\n\n(optional - reply or skip)',
    buttons: [
      [
        { text: '💰 Wealth', callback_data: 'best_wealth' },
        { text: '💜 Family', callback_data: 'best_family' },
        { text: '🏡 Home', callback_data: 'best_home' }
      ],
      [
        { text: '💪 Health', callback_data: 'best_health' },
        { text: '☀️ Joy', callback_data: 'best_joy' },
        { text: '🙏 Gratitude', callback_data: 'best_gratitude' }
      ]
    ]
  },
  {
    text: '*7. Any wins, insights, or breakthroughs today?*\n\nReply with whatever comes to mind.\n\n_Remember: Even when gratitude feels forced, it rewires your brain._ 🧠\n\nSleep well, Klemen. Tomorrow you create again. 💜',
    buttons: null
  }
];

async function sendQuestion(question, delay = 0) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: question.text,
        parse_mode: 'Markdown'
      };

      if (question.buttons) {
        payload.reply_markup = { inline_keyboard: question.buttons };
      }

      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.ok) {
          console.log('✓ Question sent:', question.text.slice(0, 50));
        } else {
          console.error('✗ Failed:', data);
        }
      } catch (err) {
        console.error('✗ Error:', err);
      }

      resolve();
    }, delay);
  });
}

async function sendAll() {
  console.log(`[${new Date().toISOString()}] Sending evening reflection form...`);
  
  for (let i = 0; i < questions.length; i++) {
    await sendQuestion(questions[i], i * 2000); // 2 second delay between questions
  }
  
  console.log('✓ All questions sent');
}

sendAll();
