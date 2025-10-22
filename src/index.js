import { Bot, InputFile } from 'grammy';
import dotenv from 'dotenv';
import { autoRetry } from '@grammyjs/auto-retry';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_LINK = process.env.MINI_APP_LINK;

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

bot.start({
  onStart: (botInfo) => {
    console.log(`✅ Bot @${botInfo.username} is up and running!`);
  },
  dropPendingUpdates: true,
});

process.once('SIGINT', () => {
  console.log('🛑 Stopping bot (SIGINT)...');
  bot.stop();
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('🛑 Stopping bot (SIGTERM)...');
  bot.stop();
  process.exit(0);
});

