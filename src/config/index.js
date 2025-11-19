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
    throw new Error('BOT_TOKEN is not defined in environment variables');
  }
  
  if (!config.miniAppLink) {
    console.warn('⚠️  MINI_APP_LINK is not set');
  }
  
  if (!config.webhookBaseUrl) {
    console.warn('⚠️  WEBHOOK_BASE_URL is not set, webhook auto-setup will be skipped');
  }

  if (!config.port) {
    throw new Error('PORT is not defined in environment variables');
  }

  if (!config.env) {
    throw new Error('APP_ENV is not defined in environment variables');
  }

  if (!config.webhookPath) {
    throw new Error('WEBHOOK_PATH is not defined in environment variables');
  }

  if (!config.webhookSecretToken) {
    throw new Error('WEBHOOK_SECRET_TOKEN is not defined in environment variables');
  }

  if (!config.webhookDropPendingUpdates) {
    throw new Error('WEBHOOK_DROP_PENDING_UPDATES is not defined in environment variables');
  }
}

