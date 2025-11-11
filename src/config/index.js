import dotenv from 'dotenv';

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN,
  miniAppLink: process.env.MINI_APP_LINK,
  port: process.env.PORT || 3030,
  webhookPath: process.env.WEBHOOK_PATH || '/telegram/webhook/bot',
};

export function validateConfig() {
  if (!config.botToken) {
    throw new Error('BOT_TOKEN is not defined in environment variables');
  }
  
  if (!config.miniAppLink) {
    console.warn('⚠️  MINI_APP_LINK is not set');
  }
}

