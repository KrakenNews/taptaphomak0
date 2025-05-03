import asyncio
from telegram.ext import MessageHandler, filters
import threading
import random
import os
import http.server
import socketserver
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, BotCommand, MenuButtonCommands
from telegram.ext import Application, CommandHandler, ContextTypes
import nest_asyncio
# --- Telegram-бот ---
nest_asyncio.apply()
# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        keyboard = [
            [InlineKeyboardButton("Перейти к игре", url="https://czolowek.github.io/TapKraken1/")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        with open("Cover image.png", "rb") as photo:
            await context.bot.send_photo(
                chat_id=update.effective_chat.id,
                photo=photo,
                caption=(
                    "🎉 Добро пожаловать в TapKraken! 🐙\n"
                    "Готов к настоящему веселью и эпичным кликам? 🚀\n\n"
                    "💰 Сокровища ждут — не заставляй Кракена скучать! 💝🌊\n"
                    "👇 Жми на кнопку ниже и погружайся в игру! 💥\n"
                ),
                reply_markup=reply_markup
            )
    except Exception as e:
        print(f"Ошибка в команде /start: {e}")

# Команда /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        help_text = (
            "ℹ️ *Доступные команды:*\n\n"
            "▶️ /start - Начать игру и получить ссылку на TapKraken 🐙\n"
            "❓ /help - Получить информацию о боте и его функциях\n\n"
            "📩 *Связаться с нами:*\n"
            "Если у вас есть вопросы или жалобы, напишите нам на email: "
            "[tapkraken@gmail.com](mailto:tapkraken@gmail.com)\n"
            "Или напишите нам в WhatsApp: [+48516015761](https://wa.me/+48516015761)\n"
            "Мы всегда рады помочь! 😊"
        )

        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=help_text,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка в команде /help: {e}")

# Команда /invite
async def invite(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Шаг 1: Попросим пользователя отправить сообщение
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="🎉 *Отправьте это сообщение тому, кого хотите пригласить в игру TapKraken!* 🐙\n\n"
        )
        
        # Шаг 2: Отправляем приглашение с баннером и текстом в одном сообщении без пустых строк
        with open("баннер.webp", "rb") as banner_image:
            invite_message = (
                "🎉 *яйцо глеба пригласил тебя в игру TapKraken!* 🐙"
                "🔗 Перейди по ссылке и стань частью нашего веселого мира кликов: https://t.me/Tap2Kraken2Bot"
                "💥 Побеждай, заработай Kraken 💰 и стань лучшим! 🚀"
                "Приятной игры и новых побед! 🎮"
            )

            # Отправляем приглашение с баннером и текстом
            await context.bot.send_photo(
                chat_id=update.effective_chat.id,
                photo=banner_image,
                caption=invite_message
            )

    except Exception as e:
        print(f"Ошибка в команде /invite: {e}")

# Команда /rules
async def rules(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        rules_text = (
            "🎮 *Правила TapKraken:*\n"
            "👆 Всё просто — тапай, веселись и побеждай!\n\n"
            "🕹️ Как играть:\n"
            "⚡ Жми на Кракена, чтобы зарабатывать *Kraken Coin 🪙*\n"
            "📈 Чем больше монет — тем выше ты в рейтинге!\n"
            "🔄 Следи за обновлениями — будет много нового и крутого!\n\n"
            "🚫 *Что нельзя делать:*\n"
            "❌ Писать гадости в поддержку\n"
            "❌ Использовать мат и токсичные фразы\n"
            "❌ Применять читы или сторонние скрипты\n\n"
            "🌟 Игра создана для кайфа! Уважай других и наслаждайся игрой 💜\n"
            "👫 Зови друзей и делайте кракенов счастливыми вместе! 🐙"
        )
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=rules_text,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка в команде /rules: {e}")

# Команда /review (для отзывов)
async def review(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="✍️ Пожалуйста, введите свой отзыв о боте или игре:\n\n"
                 "📝 Напишите о том, что вам нравится, и что бы вы хотели улучшить. Мы всегда рады услышать ваше мнение! 😊",
        )
    except Exception as e:
        print(f"Ошибка в команде /review: {e}")

# Сбор отзывов
async def collect_feedback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        feedback_message = update.message.text
        username = update.effective_user.username or update.effective_user.first_name

        with open("otzivi.txt", "a", encoding="utf-8") as file:
            file.write(f"Отзыв от {username}: {feedback_message}\n")

        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="💬 Спасибо за ваш отзыв! Мы обязательно его прочитаем и постараемся сделать игру ещё лучше! 🎮😊"
        )
    except Exception as e:
        print(f"Ошибка при сборе отзыва: {e}")

# Команда /info
async def info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        info_text = (
            "🧑‍💻 *О боте:*\n\n"
            "Бот создан для того, чтобы пользователи могли наслаждаться игрой TapKraken.\n"
            "Проект разрабатывается командой энтузиастов. Мы надеемся, что вам понравится!"
        )
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=info_text,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка в команде /info: {e}")

# Локальный сервер
def run_server():
    os.chdir("c:/Users/ProLogix/Desktop/taptaphomak/docs")
    PORT = 5000
    Handler = http.server.SimpleHTTPRequestHandler

    if not os.path.exists("index.html"):
        print("Ошибка: Файл index.html не найден в текущей директории.")
        return

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Сервер запущен на http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except OSError as e:
        print(f"Ошибка при запуске сервера: {e}")

# Основная функция для запуска бота
async def main():
    try:
        # Запуск локального сервера в отдельном потоке
        server_thread = threading.Thread(target=run_server)
        server_thread.daemon = True
        server_thread.start()

        application = Application.builder().token("8160638043:AAGVn4wvRKKamkSPrfoxWDv19LTp3mSFFU8").build()

        # Обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CommandHandler("invite", invite))
        application.add_handler(CommandHandler("rules", rules))
        application.add_handler(CommandHandler("review", review))  # Отзывы через /review
        application.add_handler(CommandHandler("info", info))

        # Обработчик сообщений (для отзывов)
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, collect_feedback))

        # Кнопки меню
        commands = [
            BotCommand("start", "Начать игру"),
            BotCommand("help", "Получить информацию о боте"),
            BotCommand("invite", "Пригласить друзей в игру"),
            BotCommand("rules", "Правила игры"),
            BotCommand("review", "Оставить отзыв"),
            BotCommand("info", "Информация о боте"),
            BotCommand("leaderboard", "Топ пользователей")
        ]
        await application.bot.set_my_commands(commands)

        # Настроим кнопки меню для чата с пользователем
        menu_buttons = [
            InlineKeyboardButton("Начать игру", callback_data='/start'),
            InlineKeyboardButton("Правила игры", callback_data='/rules'),
            InlineKeyboardButton("Обратная связь", callback_data='/review'),
            InlineKeyboardButton("Контакты", callback_data='/help'),
            InlineKeyboardButton("Информация о боте", callback_data='/info')
        ]
        menu_markup = InlineKeyboardMarkup([menu_buttons])

        await application.bot.set_chat_menu_button(menu_button=MenuButtonCommands())
        print("Кнопка Menu установлена ✅")

        # Запуск бота
        print("Telegram-бот запущен. Ожидание команд...")
        await application.run_polling()

    except Exception as e:
        print(f"Ошибка при запуске бота: {e}")

# Запуск
if __name__ == "__main__":
    asyncio.run(main())  # Работает благодаря nest_asyncio
