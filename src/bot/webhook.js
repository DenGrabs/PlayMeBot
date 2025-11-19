import { config } from '../config/index.js';
import { bot } from './bot.js';

export async function setupWebhook() {
  if (!config.webhookBaseUrl) {
    return { configured: false, reason: 'WEBHOOK_BASE_URL not provided' };
  }

  const url = `${config.webhookBaseUrl}${config.webhookPath}`;

  await bot.api.setWebhook(url, {
    secret_token: config.webhookSecretToken || undefined,
    drop_pending_updates: config.webhookDropPendingUpdates,
  });

  return { configured: true, url };
}


