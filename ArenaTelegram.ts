import { Bot, InlineKeyboard } from "grammy";
import "dotenv/config";
import axios from "axios";
import cron from "node-cron";

const apiToken = process.env.TOKEN || "";
const CHANNEL_NAME = process.env.CHANNEL_NAME || "";
const bot = new Bot(apiToken);

const ARENA_API = 'https://api.are.na/v2/channels/';

async function fetchLatestBlocks(channel: string, count: number = 5) {
    const perPage = 100;
    let page = 1;
    let blocks: any[] = [];

    while (true) {
        const response = await axios.get(`${ARENA_API}${channel}/contents`, {
            params: { page, per: perPage },
        });

        blocks = blocks.concat(response.data.contents);
        if (response.data.contents.length < perPage) break;

        page++;
    }

    blocks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return blocks.slice(0, count);
}

async function fetchChannelBlockCount(channel: string) {
    const response = await axios.get(`${ARENA_API}${channel}`);
    return response.data.length || response.data.length_cache || "Unknown";
}

const keyboard = new InlineKeyboard()
    .text("📖 info", "info")
    .text("🔍 read", "read")
    .text("🎲 random", "random"); 

bot.command("start", async ctx => {
    await ctx.reply("What would you like to do?", { reply_markup: keyboard });
});

bot.command("info", async ctx => {
    const blockCount = await fetchChannelBlockCount(CHANNEL_NAME);
    await ctx.reply(`Channel: ${CHANNEL_NAME}\nBlocks: ${blockCount}`);
});

bot.command("read", async ctx => {
    const latestBlocks = await fetchLatestBlocks(CHANNEL_NAME);
    const message = latestBlocks.map((block: any) =>
        `🔹 ${block.title || block.description || "Untitled"}\n${block.source?.url || ""}`
    ).join("\n\n");

    await ctx.reply(`🆕 Latest blocks from #${CHANNEL_NAME}:\n\n${message}`);
});

bot.command("random", async ctx => {
    const allBlocks = await fetchLatestBlocks(CHANNEL_NAME,1000);

    if (allBlocks.length === 0) {
        await ctx.reply("No blocks found in the channel.");
        return;
    }

    const randomBlock = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    const message = `🎲 Random block:\n\n🔹 ${randomBlock.title || randomBlock.description || "Untitled"}\n${randomBlock.source?.url || ""}`;

    await ctx.reply(message);
});


bot.callbackQuery("info", async ctx => {
    const blockCount = await fetchChannelBlockCount(CHANNEL_NAME);
    await ctx.answerCallbackQuery();
    await ctx.reply(`Channel: ${CHANNEL_NAME}\nBlocks: ${blockCount}`);
});

bot.callbackQuery("read", async ctx => {
    const latestBlocks = await fetchLatestBlocks(CHANNEL_NAME);
    const message = latestBlocks.map((block: any) =>
        `🔹 ${block.title || block.description || "Untitled"}\n${block.source?.url || ""}`
    ).join("\n\n");

    await ctx.answerCallbackQuery();
    await ctx.reply(`🆕 Latest blocks from #${CHANNEL_NAME}:\n\n${message}`);
});

bot.callbackQuery("random", async ctx => {
    const allBlocks = await fetchLatestBlocks(CHANNEL_NAME, 1000);

    if (allBlocks.length === 0) {
        await ctx.answerCallbackQuery();
        await ctx.reply("No blocks found in the channel.");
        return;
    }

    const randomBlock = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    const message = `🎲 Random block:\n\n🔹 ${randomBlock.title || randomBlock.description || "Untitled"}\n${randomBlock.source?.url || ""}`;

    await ctx.answerCallbackQuery();
    await ctx.reply(message);
});

async function sendLatestBlocks() {
    const latestBlocks = await fetchLatestBlocks(CHANNEL_NAME);
    const message = latestBlocks.map((block: any) =>
        `🔹 ${block.title || block.description || "Untitled"}\n${block.source?.url || ""}`
    ).join("\n\n");

    const chatId = process.env.CHAT_ID;
    if (chatId) {
        await bot.api.sendMessage(chatId, `🆕 Latest blocks from #${CHANNEL_NAME}:\n\n${message}`);
    }
}

async function sendRandomBlock() {
    const allBlocks = await fetchLatestBlocks(CHANNEL_NAME, 1000);

    if (allBlocks.length === 0) return;

    const randomBlock = allBlocks[Math.floor(Math.random() * allBlocks.length)];
    const message = `🎲 Random block:\n\n🔹 ${randomBlock.title || randomBlock.description || "Untitled"}\n${randomBlock.source?.url || ""}`;

    const chatId = process.env.CHAT_ID;
    if (chatId) {
        await bot.api.sendMessage(chatId, message);
    }
}

async function startBot() {
    await bot.start();
    console.info("Are.na blocks bot is running");
}

startBot();

// Run every 12 hours
cron.schedule("0 */12 * * *", sendLatestBlocks);
// Run every 6 hours
cron.schedule("0 */6 * * *", sendRandomBlock);

