import { Bot, InputFile, webhookCallback } from 'grammy';
import express from 'express';
import dotenv from 'dotenv';
import { autoRetry } from '@grammyjs/auto-retry';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_LINK = process.env.MINI_APP_LINK;
const PORT = process.env.PORT || 3030;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH || `/webhook/${BOT_TOKEN}`;

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

console.log('🔧 Configuration:');
console.log(`  PORT: ${PORT}`);
console.log(`  WEBHOOK_PATH: ${WEBHOOK_PATH}`);
console.log(`  MINI_APP_LINK: ${MINI_APP_LINK || 'NOT SET'}`);
console.log('');

const bot = new Bot(BOT_TOKEN);

bot.api.config.use(autoRetry({
  maxRetryAttempts: 3, 
  maxDelaySeconds: 60,
}));

// Log all updates that Grammy receives
bot.use(async (ctx, next) => {
  console.log(`\n🎯 ===== GRAMMY MIDDLEWARE START =====`);
  console.log(`🎯 Update ID:`, ctx.update.update_id);
  console.log(`🎯 Update keys:`, Object.keys(ctx.update));
  console.log(`🎯 Has message:`, !!ctx.message);
  console.log(`🎯 Message text:`, ctx.message?.text);
  console.log(`🎯 Chat type:`, ctx.chat?.type);
  console.log(`🎯 ===== GRAMMY MIDDLEWARE END =====\n`);
  await next();
  console.log(`🎯 After next() - handlers completed`);
});

bot.api.setMyCommands([
  { command: 'start', description: '🔥 Начать игру' }
]);

bot.command('start', async (ctx) => {
  try {
    console.log(`👤 Processing /start command from user ${ctx.from?.id}`);
    
    if (!ctx.hasChatType(["private"])) {
      console.log(`⚠️  Ignoring /start from non-private chat`);
      return;
    }
    
    await ctx.replyWithPhoto(
      new InputFile('./assets/Img2.png'),
      {
        caption: '🔥OnlyHot\n\n'+
                 'OnlyHot — это не просто игра, это огненный коктейль из страсти, красоты и дерзких искушений! 💋\n\n' +
                 '✨ Здесь каждая героиня — это пламя... А тебе предстоит решить: обжечься или разжечь его еще сильнее? ❤️‍🔥', 
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔥 Играть', url: MINI_APP_LINK }],
          ],
        },
        parse_mode: 'HTML',
      }
    );
    
    console.log(`✅ Successfully sent /start response to user ${ctx.from?.id}`);
  } catch (error) {
    console.error(`❌ Error handling /start command:`, error);
    // Try to send a simple text message as fallback
    try {
      await ctx.reply('Привет! 👋 К сожалению, произошла ошибка при загрузке изображения.');
    } catch (fallbackError) {
      console.error(`❌ Fallback message also failed:`, fallbackError);
    }
  }
});

bot.on('message', async (ctx) => {
  try {
    console.log(`💬 Processing general message from user ${ctx.from?.id}: ${ctx.message.text}`);
    await ctx.reply('👋 Hi! Use /start to begin.');
    console.log(`✅ Successfully sent response to user ${ctx.from?.id}`);
  } catch (error) {
    console.error(`❌ Error handling message:`, error);
  }
});

// Catch-all to see if we reach any handler
bot.on('message:text', (ctx) => {
  console.log(`📝 Catch-all handler reached for text: "${ctx.message.text}"`);
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error('\n' + '❌'.repeat(20));
  console.error('❌ Grammy Error Handler Triggered:');
  console.error(`Update ID: ${ctx.update.update_id}`);
  console.error(`Error: ${err.error.message}`);
  console.error(`Stack: ${err.error.stack}`);
  console.error('❌'.repeat(20) + '\n');
});

// Initialize Express app
const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoint for Telegram
// Note: Webhook is set by external service (api.staging.onlyhot.ai)
// This bot just receives proxied requests
app.use(express.json());

// Create webhook handler once
const handleWebhook = webhookCallback(bot, 'express');

// Logging middleware for webhook requests
app.post(WEBHOOK_PATH, 
  (req, res, next) => {
    const update = req.body;
    const timestamp = new Date().toISOString();
    
    // Log basic update info
    console.log(`\n${'='.repeat(60)}`);
    console.log(`[${timestamp}] 📨 Webhook request received`);
    console.log(`Update ID: ${update.update_id || 'N/A'}`);
    
    // Log message details if present
    if (update.message) {
      const msg = update.message;
      console.log(`Type: message`);
      console.log(`From: ${msg.from?.username || msg.from?.first_name || 'Unknown'} (ID: ${msg.from?.id})`);
      console.log(`Chat: ${msg.chat?.type} (ID: ${msg.chat?.id})`);
      console.log(`Text: ${msg.text || msg.caption || '[non-text message]'}`);
    }
    
    // Log callback query details if present
    if (update.callback_query) {
      const cb = update.callback_query;
      console.log(`Type: callback_query`);
      console.log(`From: ${cb.from?.username || cb.from?.first_name || 'Unknown'} (ID: ${cb.from?.id})`);
      console.log(`Data: ${cb.data}`);
    }
    
    // Log other update types
    if (update.edited_message) {
      console.log(`Type: edited_message`);
    }
    if (update.channel_post) {
      console.log(`Type: channel_post`);
    }
    
    console.log(`${'='.repeat(60)}\n`);
    console.log(`🔄 Passing to Grammy webhookCallback...`);
    
    next();
  },
  handleWebhook
);

// Test endpoint to verify routing
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Bot is running!',
    webhookPath: WEBHOOK_PATH,
    port: PORT
  });
});

// Start server (without setting webhook - handled by external service)
const startServer = async () => {
  try {
    const botInfo = await bot.api.getMe();
    console.log(`✅ Bot @${botInfo.username} is ready to receive webhook requests!`);
    console.log(`📍 Webhook endpoint: POST http://localhost:${PORT}${WEBHOOK_PATH}`);
    console.log(`🧪 Test endpoint: GET http://localhost:${PORT}/test`);
    console.log(`ℹ️  Webhook is managed by external service`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`💡 Your API service should forward Telegram updates to this endpoint`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.once('SIGINT', () => {
  console.log('🛑 Stopping bot (SIGINT)...');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('🛑 Stopping bot (SIGTERM)...');
  process.exit(0);
});

