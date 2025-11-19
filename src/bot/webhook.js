import { config } from '../config/index.js';
import { bot } from './bot.js';

export async function setupWebhook() {
  if (!config.webhookBaseUrl) {
    return { configured: false, reason: 'WEBHOOK_BASE_URL not provided' };
  }

  const url = `${config.webhookBaseUrl}${config.webhookPath}`;

  const webhookResponse = await bot.api.setWebhook(url, {
    secret_token: config.webhookSecretToken || undefined,
    drop_pending_updates: config.webhookDropPendingUpdates,
  });

  console.log('Webhook response:', webhookResponse);

  return { configured: true, url };
}


