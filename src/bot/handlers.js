import { InputFile } from 'grammy';
import messages from '../contants/messages.js';
import buttons from '../contants/buttons.js';
import { bot } from './bot.js';

bot.command('start', async (ctx) => {
  if (!ctx.hasChatType(['private'])) {
    return;
  }
  
  const language = ctx.from.language_code === 'ru' ? 'ru' : 'en';
  try {
    await ctx.replyWithPhoto(
      new InputFile('./assets/Img2.png'),
      {
        caption: messages.start[language], 
        reply_markup: {
          inline_keyboard: buttons.start[language],
        },
        parse_mode: 'HTML',
      }
    );
    console.log(`✅ /start → user ${ctx.from.id}`);
  } catch (error) {
    console.error(`❌ /start error:`, error.message);
    try {
      await ctx.reply('Something went wrong');
    } catch {}
  }
});

