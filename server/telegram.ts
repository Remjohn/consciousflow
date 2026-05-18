import { Telegraf } from 'telegraf';
import { db } from '../src/db';
import { dailyLogs, users } from '../src/db/schema';
import { eq, and } from 'drizzle-orm';
import OpenAI from 'openai'; // or we can use the Mistral fetch from index.ts
import { format } from 'date-fns';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_ALLOWED_CHAT_ID = process.env.TELEGRAM_ALLOWED_CHAT_ID;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export const setupTelegramBot = () => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ALLOWED_CHAT_ID) {
        console.warn('⚠️ Telegram Bot integration is disabled. Missing TELEGRAM_BOT_TOKEN or TELEGRAM_ALLOWED_CHAT_ID in .env');
        return null;
    }

    const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

    // Middleware to restrict access
    bot.use(async (ctx, next) => {
        if (ctx.chat?.id.toString() !== TELEGRAM_ALLOWED_CHAT_ID) {
            console.warn(`Unauthorized access attempt from chat ID: ${ctx.chat?.id}`);
            return;
        }
        await next();
    });

    bot.command('start', (ctx) => {
        ctx.reply('🛡️ THE FORTRESS UPLINK ESTABLISHED.\n\nYou are authorized to submit daily Mission Debriefs here. Send any text to log it as today\'s journal entry.');
    });

    bot.on('text', async (ctx) => {
        try {
            const text = ctx.message.text;
            const todayDate = format(new Date(), 'yyyy-MM-dd');
            const userId = 1; // Hardcoded Emilio

            ctx.reply('📡 Receiving transmission...');

            // 1. Ensure user exists
            const existingUser = await db.select().from(users).where(eq(users.id, userId));
            if (existingUser.length === 0) {
                await db.insert(users).values({
                    name: 'Emilio',
                    email: 'emilio.consciouselite@gmail.com',
                    currentBalance: '0',
                    videosTotal: 0
                });
            }

            // 2. Find or create today's log
            const logs = await db.select().from(dailyLogs).where(
                and(eq(dailyLogs.userId, userId), eq(dailyLogs.date, todayDate))
            );

            let logId: number;
            let currentJournal = '';

            if (logs.length > 0) {
                logId = logs[0].id;
                currentJournal = logs[0].journalEntry || '';
                
                const updatedJournal = currentJournal 
                    ? `${currentJournal}\n\n[Telegram Update ${format(new Date(), 'HH:mm')}]:\n${text}`
                    : text;

                await db.update(dailyLogs)
                    .set({ journalEntry: updatedJournal })
                    .where(eq(dailyLogs.id, logId));
            } else {
                // Create new log
                const inserted = await db.insert(dailyLogs).values({
                    userId,
                    date: todayDate,
                    journalEntry: text,
                    videosProduced: 0,
                    pomodoros: 0,
                    isPunished: true, // Default to true until videos > 5
                    aiResponse: 'PENDING',
                }).returning();
                logId = inserted[0].id;
            }

            // 3. Ask AI for Debrief Assessment
            let aiMessage = "Journal Logged. Mission Complete.";
            
            if (MISTRAL_API_KEY) {
                try {
                    const systemPrompt = `
YOU ARE THE AI MISSION COMMANDER. THE OPERATIVE JUST SUBMITTED THIS JOURNAL DEBRIEF VIA SECURE TELEGRAM UPLINK.
Reply with a ruthless, concise 3-sentence military assessment of their performance.
`;
                    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${MISTRAL_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "mistral-large-2512",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: text }
                            ]
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        aiMessage = data.choices[0]?.message?.content || aiMessage;
                        
                        // Save AI response
                        await db.update(dailyLogs)
                            .set({ aiResponse: aiMessage })
                            .where(eq(dailyLogs.id, logId));
                    }
                } catch (aiError) {
                    console.error('AI debrief failed:', aiError);
                }
            }

            ctx.reply(`✅ DEBRIEF SECURED.\n\nCOMMANDER'S ASSESSMENT:\n${aiMessage}`);

        } catch (error) {
            console.error('Telegram Bot Error:', error);
            ctx.reply('❌ SYSTEM FAILURE. Could not write to Fortress DB.');
        }
    });

    // Start polling
    bot.launch().then(() => {
        console.log('🚀 Telegram Bot Uplink Active (Long Polling)');
    }).catch((err) => {
        console.error('⚠️ Telegram Bot failed to launch (invalid token or network error):', err.message);
    });

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return bot;
};
