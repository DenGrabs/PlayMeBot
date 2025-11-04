import { Bot, InputFile, webhookCallback } from 'grammy';
import express from 'express';
import dotenv from 'dotenv';
import { autoRetry } from '@grammyjs/auto-retry';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_LINK = process.env.MINI_APP_LINK;
const PORT = process.env.PORT || 3030;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH;

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

bot.api.config.use(autoRetry({
  maxRetryAttempts: 3, 
  maxDelaySeconds: 60,
}));

bot.api.setMyCommands([
  { command: 'start', description: '🔥 Начать игру' }
]);

bot.command('start', async (ctx) => {
  if (!ctx.hasChatType(["private"])) {
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
});

bot.on('message', async (ctx) => {
  await ctx.reply('👋 Hi! Use /start to begin.');
});

bot.catch((err) => {
  console.error('Error occurred:', err);
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
app.post(WEBHOOK_PATH, webhookCallback(bot, 'express'));

// Start server (without setting webhook - handled by external service)
const startServer = async () => {
  try {
    const botInfo = await bot.api.getMe();
    console.log(`✅ Bot @${botInfo.username} is ready to receive webhook requests!`);
    console.log(`📍 Webhook endpoint: POST http://localhost:${PORT}${WEBHOOK_PATH}`);
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

