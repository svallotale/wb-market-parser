# wb-market-parser

[![npm version](https://img.shields.io/npm/v/wb-market-parser.svg)](https://www.npmjs.com/package/wb-market-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Парсер для получения информации о пунктах выдачи Wildberries. Библиотека предоставляет удобный API для работы с данными о пунктах выдачи, включая их адреса, координаты, режимы работы и другую информацию.

## Особенности

- 🚀 Быстрый доступ к данным через кэширование
- 📍 Поддержка геолокации и координат
- 🌍 Мультиязычность (поддержка разных стран)
- 🔄 Автоматическое обновление данных
- 📦 Поддержка CommonJS и ESM
- 📝 Полная поддержка TypeScript

## Установка

```bash
npm install wb-market-parser
```

или

```bash
yarn add wb-market-parser
```

## Использование

### CommonJS

```javascript
const { WbMarketParser } = require('wb-market-parser');

const parser = new WbMarketParser();
```

### ESM

```javascript
import { WbMarketParser } from 'wb-market-parser';

const parser = new WbMarketParser();
```

## API

### Конструктор

```typescript
new WbMarketParser(config?: {
  cacheDuration?: number; // длительность кэширования в миллисекундах (по умолчанию 5 минут)
  logger?: {
    log: (message: string) => void;
    error: (message: string, error?: Error) => void;
    debug: (message: string) => void;
  };
})
```

### Методы

#### `getCountries()`
Возвращает список всех стран, где есть пункты выдачи.

```typescript
const countries = await parser.getCountries();
// ['Russia', 'Belarus', ...]
```

#### `getByCountry(country: string)`
Возвращает список пунктов выдачи для указанной страны.

```typescript
const markets = await parser.getByCountry('Russia');
// [{ id: 1, address: 'Moscow, Red Square 1', ... }, ...]
```

#### `getById(id: number)`
Возвращает пункт выдачи по его ID.

```typescript
const market = await parser.getById(1);
// [{ id: 1, address: 'Moscow, Red Square 1', ... }]
```

#### `markets()`
Возвращает все данные о пунктах выдачи, сгруппированные по странам.

```typescript
const allMarkets = await parser.markets();
// [{ country: 'Russia', markets: [...] }, ...]
```

## Кэширование

Библиотека использует встроенное кэширование для оптимизации производительности и уменьшения нагрузки на API Wildberries. 

### Настройка кэширования

```typescript
const parser = new WbMarketParser({
  cacheDuration: 10 * 60 * 1000 // кэш на 10 минут
});
```

### Особенности кэширования

- Данные кэшируются в памяти
- Кэш автоматически обновляется при истечении срока действия
- При ошибках загрузки данных используются кэшированные данные, если они доступны
- Кэш очищается при создании нового экземпляра парсера

## Типы данных

```typescript
interface MarketType {
  Items: {
    country: string;
    markets: {
      id: number;
      address: string;
      coordinates: [number, number];
      workTime: string;
      photos: string[];
      typePoint: number;
      dtype: number;
      isWb: boolean;
      pickupType: number;
      dest: number;
      dest3: number;
      sign: string;
    }[];
  }[];
}
```

## Разработка

### Установка зависимостей

```bash
npm install
```

### Запуск тестов

```bash
npm test
```

### Сборка

```bash
npm run build
```

### Структура проекта

```
wb-market-parser/
├── src/
│   ├── index.ts        # Точка входа
│   ├── market.ts       # Основная логика парсера
│   ├── market.test.ts  # Тесты
│   └── types.ts        # Типы данных
├── package.json
└── README.md
```

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Вот как вы можете помочь:

1. **Сообщения об ошибках**
   - Используйте GitHub Issues
   - Опишите проблему максимально подробно
   - Приложите пример кода, если возможно

2. **Pull Requests**
   - Создавайте ветку для каждой новой функции
   - Следуйте существующему стилю кода
   - Добавляйте тесты для новой функциональности
   - Обновляйте документацию

3. **Улучшение документации**
   - Исправление ошибок
   - Улучшение примеров
   - Добавление новых разделов

### Процесс разработки

1. Форкните репозиторий
2. Создайте ветку для ваших изменений
3. Внесите изменения
4. Запустите тесты: `npm test`
5. Создайте Pull Request

### Требования к коду

- Следуйте стилю кода проекта
- Пишите тесты для новой функциональности
- Обновляйте документацию при необходимости
- Используйте TypeScript для типизации

## Лицензия

MIT

## Поддержка

Если у вас возникли проблемы или есть вопросы:

- Создайте Issue на GitHub
- Опишите проблему максимально подробно
- Приложите пример кода, если возможно

## Безопасность

Если вы обнаружили уязвимость безопасности, пожалуйста, сообщите об этом через GitHub Issues или напрямую разработчикам.
