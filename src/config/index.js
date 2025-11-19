import dotenv from 'dotenv';

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN,
  miniAppLink: process.env.MINI_APP_LINK,
  port: process.env.PORT,
  env: process.env.APP_ENV,
  webhookPath: process.env.WEBHOOK_PATH,
  webhookBaseUrl: process.env.WEBHOOK_BASE_URL,
  webhookSecretToken: process.env.WEBHOOK_SECRET_TOKEN,
  webhookDropPendingUpdates: String(process.env.WEBHOOK_DROP_PENDING_UPDATES || 'true') === 'true',
};

export function validateConfig() {
  if (!config.botToken) {
    console.warn('BOT_TOKEN is not defined in environment variables');
  }
  
  if (!config.miniAppLink) {
    console.warn('MINI_APP_LINK is not defined in environment variables');
  }
  
  if (!config.webhookBaseUrl) {
    console.warn('WEBHOOK_BASE_URL is not defined in environment variables');
  }

  if (!config.port) {
    console.warn('PORT is not defined in environment variables');
  }

  if (!config.env) {
    console.warn('APP_ENV is not defined in environment variables');
  }

  if (!config.webhookPath) {
    console.warn('WEBHOOK_PATH is not defined in environment variables');
  }

  if (!config.webhookSecretToken) {
    console.warn('WEBHOOK_SECRET_TOKEN is not defined in environment variables');
  }

  if (!config.webhookDropPendingUpdates) {
    console.warn('WEBHOOK_DROP_PENDING_UPDATES is not defined in environment variables');
  }
}

