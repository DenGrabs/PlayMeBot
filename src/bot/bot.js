import { Bot } from 'grammy';
import { autoRetry } from '@grammyjs/auto-retry';
import { config } from '../config/index.js';

export const bot = new Bot(config.botToken);

bot.api.config.use(autoRetry({
  maxRetryAttempts: 3, 
  maxDelaySeconds: 60,
}));

export async function setupBotCommands() {
  await bot.api.setMyCommands([
    { command: 'start', description: '🔥 Начать игру' }
  ]);
}

export async function initializeBot() {
  await bot.init();
  await setupBotCommands();
  return bot.botInfo;
}

bot.catch((err) => {
  console.error(`❌ Error processing update ${err.ctx.update.update_id}:`, err.error.message);
});

