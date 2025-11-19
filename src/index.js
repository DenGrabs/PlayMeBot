import { config, validateConfig } from './config/index.js';
import { initializeBot } from './bot/bot.js';
import './bot/handlers.js';
import { createApp } from './server/app.js';
import { setupWebhook } from './bot/webhook.js';

console.log('Config:', config);
console.log('Environment variables:', process.env);

async function start() {
  try {
    validateConfig();
    
    const botInfo = await initializeBot();
    console.log(`✅ Bot @${botInfo.username} initialized`);
    
    const app = createApp();
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Webhook: POST http://localhost:${config.port}${config.webhookPath}`);
    });

    // Configure Telegram webhook if base URL is provided
    try {
      const result = await setupWebhook();
      if (result.configured) {
        console.log(`🔗 Webhook set: ${result.url}`);
      } else {
        console.log(`ℹ️  Webhook not set: ${result.reason}`);
      }
    } catch (err) {
      console.error('❌ Failed to configure webhook:', err.message);
    }
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
}

process.once('SIGINT', () => process.exit(0));
process.once('SIGTERM', () => process.exit(0));

start();
