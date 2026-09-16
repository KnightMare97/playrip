/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || localStorage.getItem('playrip_tg_token') || '';

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      title?: string;
      username?: string;
    };
    text?: string;
  };
}

/**
 * Sends a message via Telegram Bot API
 */
export async function sendTelegramMessage(chatId: number | string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to send Telegram message:', e);
    return false;
  }
}

/**
 * Polls recent updates from Telegram bot (Long-polling client helper)
 */
export async function fetchTelegramUpdates(offset?: number): Promise<TelegramUpdate[]> {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?timeout=1${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.result || [];
  } catch (e) {
    console.error('Failed to fetch Telegram updates:', e);
    return [];
  }
}
