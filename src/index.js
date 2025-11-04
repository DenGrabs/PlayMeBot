import { Bot, InputFile, webhookCallback } from 'grammy';
import express from 'express';
import dotenv from 'dotenv';
import { autoRetry } from '@grammyjs/auto-retry';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_LINK = process.env.MINI_APP_LINK;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3030;

if (!BOT_TOKEN) {
  console.error('Error: BOT_TOKEN is not defined in environment variables');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('Error: WEBHOOK_URL is not defined in environment variables');
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
app.use(express.json());
app.post(`/webhook/${BOT_TOKEN}`, webhookCallback(bot, 'express'));

// Start server and set webhook
const startServer = async () => {
  try {
    // Set webhook
    await bot.api.setWebhook(`${WEBHOOK_URL}/webhook/${BOT_TOKEN}`, {
      drop_pending_updates: true,
    });
    
    const webhookInfo = await bot.api.getWebhookInfo();
    console.log('✅ Webhook set successfully!');
    console.log(`📍 Webhook URL: ${webhookInfo.url}`);
    console.log(`🔄 Pending updates: ${webhookInfo.pending_update_count}`);
    
    const botInfo = await bot.api.getMe();
    console.log(`✅ Bot @${botInfo.username} is up and running with webhooks!`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
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

