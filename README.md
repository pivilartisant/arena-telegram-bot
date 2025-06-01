# 🤖 Are.na Telegram Bot

A simple Telegram bot that fetches and shares content from an [Are.na](https://www.are.na/) channel. It provides latest blocks, random blocks, and channel info.

---

## 🚀 Features

- `/start` – Show inline options  
- `/info` – Get block count of the Are.na channel  
- `/read` – Fetch and display the latest blocks  
- `/random` – Get a random block  

**Auto-posts:**
- 🕛 Latest blocks every 12 hours
- 🎲 Random block every 6 hours

---

## 🛠️ Setup Instructions

### 1. Clone this Repository

```bash
git clone https://github.com/yourusername/arena-telegram-bot.git
cd arena-telegram-bot
````

### 2. Install Dependencies

```bash
bun install
```

### 3. Create a `.env` File

Create a `.env` file in the root directory with the following contents:

```env
TOKEN=your_telegram_bot_token
CHANNEL_NAME=your_arena_channel_slug
```

* `TOKEN`: Your Telegram bot token from [BotFather](https://t.me/BotFather)
* `CHANNEL_NAME`: The slug of your Are.na channel (e.g. `creative-inspiration`)

### 4. Run the Bot

```bash
bun run ArenaTelegram.ts
```

---

## 📦 Built With

* [grammy](https://grammy.dev/) – Telegram bot framework
* [Are.na API](https://dev.are.na/documentation/channels) – To fetch channel content

---

## 🧠 Notes

* The bot fetches and posts blocks based on creation date.
* Scheduled tasks are automatically set when the bot starts.
* For group chats make sure the bot is added to the group and has permission to send messages.

---

