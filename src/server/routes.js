import express from 'express';
import { bot } from '../bot/bot.js';
import { config } from '../config/index.js';

export const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/test', (req, res) => {
  res.json({ 
    message: 'Bot is running',
    webhookPath: config.webhookPath,
    port: config.port
  });
});

router.post(config.webhookPath, async (req, res) => {
  const update = req.body;
  
  try {
    logUpdate(update);
    await bot.handleUpdate(update);
    res.status(200).send('OK');
  } catch (error) {
    console.error(`❌ Update ${update.update_id} error:`, error.message);
    res.status(200).send('OK'); 
  }
});

function logUpdate(update) {
  const id = update.update_id;
  
  if (update.message) {
    const msg = update.message;
    const from = msg.from?.username || msg.from?.first_name || 'Unknown';
    const text = msg.text || msg.caption || '[media]';
    console.log(`📨 Update ${id}: ${from} → ${text}`);
  } else if (update.callback_query) {
    const cb = update.callback_query;
    const from = cb.from?.username || cb.from?.first_name || 'Unknown';
    console.log(`📨 Update ${id}: ${from} → callback: ${cb.data}`);
  } else {
    const type = Object.keys(update).find(k => k !== 'update_id') || 'unknown';
    console.log(`📨 Update ${id}: ${type}`);
  }
}

