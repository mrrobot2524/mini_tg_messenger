# Telegram Messenger (GREEN-API Test Task)

Веб-мессенджер для отправки и получения текстовых сообщений через Telegram, интегрированный с GREEN-API. Прототип интерфейса — Telegram Web Z.

## 🔗 Демо

**[https://mini-tg-messenger.vercel.app/](https://mini-tg-messenger.vercel.app/)**

## 🎯 Реализованный функционал (по требованиям задания)

1. ✅ **Авторизация** — пользователь вводит `idInstance` и `apiTokenInstance` из системы GREEN-API
2. ✅ **Создание нового чата** — пользователь вводит `chatId` получателя и создаёт новый чат
3. ✅ **Отправка сообщений** — реализовано методом [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
4. ✅ **Получение сообщений** — реализовано методом [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) (polling `lastIncomingMessages` / `lastOutgoingMessages`)
5. ✅ **Отображение переписки** — свои сообщения справа синим, входящие слева серым
6. ✅ **Сохранение состояния** — авторизация и история чатов переживают перезагрузку страницы (localStorage)
7. ✅ **Защищённые роуты** — нельзя зайти на `/chat` без авторизации

## 🛠 Технологии

| Категория | Технология |
|-----------|------------|
| Фреймворк | React 19 + TypeScript |
| Сборщик | Vite 6 |
| Стили | Tailwind CSS 4 |
| Роутинг | React Router v7 (Data Router) |
| Серверный стейт | TanStack Query v5 |
| Клиентский стейт | Zustand (+ persist middleware) |
| Формы | React Hook Form + Zod |
| GraphQL-кэш | Apollo Client (локальный кэш-слой) |
| Архитектура | Feature-Sliced Design (FSD) |

## 📁 Структура проекта (FSD)

```
src/
├── app/                    # Глобальная настройка (провайдеры, роутер)
│   └── providers/          # RouterProvider, QueryProvider, ApolloProvider, ProtectedRoute, PublicRoute
├── pages/                  # Страницы (роуты)
│   ├── login/              # Страница входа
│   └── chat/               # Страница мессенджера
├── widgets/                # Композиционные блоки
│   ├── sidebar/            # Левая панель со списком чатов
│   └── chat-area/          # Правая область с лентой сообщений
├── features/               # Пользовательские сценарии
│   ├── auth/               # Вход в систему (RHF + Zod + useCheckAuth)
│   ├── create-chat/        # Создание нового чата
│   ├── send-message/       # Отправка сообщений (useMutation + optimistic update)
│   └── receive-messages/   # Polling входящих и исходящих сообщений
├── entities/               # Бизнес-сущности
│   ├── auth/               # Стор авторизации (Zustand + persist)
│   └── chat/               # Стор чатов и сообщений (Zustand + persist)
└── shared/                 # Переиспользуемый фундамент
    ├── ui/                 # UI-кит (Input, Button, Modal)
    ├── api/                # GREEN-API клиент
    └── lib/                # GraphQL-схема, Apollo Client
```

## 🚀 Локальный запуск

### Требования
- Node.js 18+
- npm 9+
- Аккаунт [GREEN-API](https://green-api.com) с привязанным Telegram

### Шаг 1: клонирование и установка

```bash
git clone <url-вашего-репозитория>
cd tg-messenger
npm install
```

### Шаг 2: запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

> Vite-прокси для обхода CORS уже настроен в `vite.config.ts`. Все запросы на `/green-api/*` автоматически проксируются на `https://api.green-api.com`.

### Шаг 3: получение кредов GREEN-API

1. Зарегистрируйтесь на [green-api.com](https://green-api.com)
2. Создайте инстанс типа **Telegram**
3. В настройках инстанса отсканируйте QR-код через Telegram-приложение (Настройки → Устройства → Подключить устройство)
4. Скопируйте `idInstance` и `apiTokenInstance` из кабинета

### Шаг 4: авторизация в приложении

1. Откройте `http://localhost:5173`
2. Введите `idInstance` и `apiTokenInstance`
3. Нажмите «Войти» — произойдёт проверка через `getStateInstance`

## 🧪 Как пользоваться

1. **Вход** — введите `idInstance` и `apiTokenInstance` от вашего инстанса GREEN-API
2. **Создание чата** — нажмите «+ New» в сайдбаре, введите `chatId` получателя (число)
3. **Отправка** — выберите чат, введите текст, нажмите Enter (или кнопку отправки)
4. **Получение** — собеседник отвечает в Telegram, сообщение появится в чате в течение 5-10 секунд

## ⚠️ Ограничения бесплатного тарифа GREEN-API

Проект разработан и протестирован на бесплатном тарифе GREEN-API. Учитывайте:

1. **Квота на сообщения** — ограничение в 50 сообщений в месяц
2. **Белый список получателей** — отправка возможна только на номера из белого списка (3 номера на бесплатном тарифе)
3. **Rate limit (429)** — при превышении 30 запросов/минуту polling автоматически переходит на 30-секундный интервал
4. **`deleteNotification`** — на бесплатном тарифе для Telegram этот метод возвращает 401. Поэтому для приёма сообщений используется `lastIncomingMessages` / `lastOutgoingMessages` (без удаления из очереди)

Для полноценного тестирования рекомендуется тариф **Developer** или **Business**.

## 📐 Архитектурные решения

### Optimistic Update при отправке

При нажатии Enter сообщение мгновенно появляется в UI с локальным ID (`local-{timestamp}`). После успешного ответа GREEN-API локальный ID заменяется на реальный `idMessage`. Это даёт мгновенный отклик интерфейса.

### Polling с backoff

Приём сообщений реализован через polling `lastIncomingMessages` и `lastOutgoingMessages` каждые 10 секунд. При получении ошибки 429 (Too Many Requests) интервал автоматически увеличивается до 30 секунд.

### Защита от дубликатов

Сообщения проверяются по `idMessage` перед добавлением в стор. При замене optimistic ID на реальный (в `onSuccess`) дубликаты исключаются.

### Нормализация chatId

GREEN-API присылает `chatId` с суффиксом (`@telegram`), а пользователь вводит без него. В сторе все `chatId` нормализуются (суффикс отсекается), чтобы сообщения попадали в правильный чат.

### Защита роутов

- `PublicRoute` — если пользователь уже авторизован, редирект на `/chat`
- `ProtectedRoute` — если пользователь НЕ авторизован, редирект на `/`
- Авторизация сохраняется в `localStorage` через `persist` middleware

## 🎨 Прототип дизайна

За визуальную основу взят [Telegram Web Z](https://web.telegram.org/z/):
- Тёмная тема (фон `#0E1621`, карточки `#17212B`)
- Свои сообщения — справа синим (`#2B5278`)
- Чужие сообщения — слева серым (`#182533`)
- Акцентный цвет Telegram (`#5288C1`)

## 📦 Деплой

### Production-сборка

```bash
npm run build
```

Готовая сборка будет в папке `dist/`.

### Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Импортируйте GitHub-репозиторий
3. Vercel автоматически определит Vite-проект
4. Настройте rewrite rules для прокси (см. ниже)

**`vercel.json`** (для прокси GREEN-API в production):
```json
{
  "rewrites": [
    {
      "source": "/green-api/(.*)",
      "destination": "https://api.green-api.com/$1"
    }
  ]
}
```
