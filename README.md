# Savings Calc

Простой калькулятор накоплений, который помогает быстро понять, сколько можно накопить со временем с учетом регулярных пополнений и роста суммы.

Simple savings calculator that helps you quickly estimate how much money you can build over time with regular contributions and growth.

## Русский

`Savings Calc` помогает обычному пользователю:

- прикинуть будущую сумму накоплений
- посмотреть, как влияют регулярные пополнения
- понять разницу между стартовой суммой, взносами и итоговым результатом

### Команды

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm preview
```

### Структура

- `src/App.tsx` - основной экран формы
- `src/components/results-screen.tsx` - экран результатов
- `src/lib/savings.ts` - расчеты накоплений
- `src/lib/validation.ts` - нормализация и валидация формы

### Сборка

Продакшен-сборка создается в `dist/`. Эта папка не хранится в git.

## English

`Savings Calc` is meant for everyday users who want to:

- estimate future savings
- see how recurring contributions affect the result
- understand the difference between starting amount, contributions, and final total

### Commands

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm preview
```

### Structure

- `src/App.tsx` - main form screen
- `src/components/results-screen.tsx` - results screen
- `src/lib/savings.ts` - savings calculation logic
- `src/lib/validation.ts` - form normalization and validation

### Build

Production build is generated in `dist/`. This folder is ignored by git.
