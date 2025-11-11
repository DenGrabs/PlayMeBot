import { config, validateConfig } from './config/index.js';
import { initializeBot } from './bot/bot.js';
import './bot/handlers.js';
import { createApp } from './server/app.js';

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
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
}

process.once('SIGINT', () => process.exit(0));
process.once('SIGTERM', () => process.exit(0));

start();
