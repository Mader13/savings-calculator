# Savings Calc

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/License-Private-black)](https://github.com/Mader13/savings-calculator)

Простой калькулятор накоплений, который помогает быстро понять, сколько можно накопить со временем с учетом регулярных пополнений и роста суммы.

Simple savings calculator that helps you quickly estimate how much money you can build over time with regular contributions and growth.

## Русский

`Savings Calc` помогает обычному пользователю:

- прикинуть будущую сумму накоплений
- посмотреть, как влияют регулярные пополнения
- понять разницу между стартовой суммой, взносами и итоговым результатом

### Быстрый старт

```bash
pnpm install
pnpm dev
```

После запуска откройте адрес, который покажет Vite в терминале. Обычно это `http://localhost:5173`.

### Как пользоваться

1. Введите сумму цели.
2. Выберите дату, к которой хотите накопить.
3. Укажите доход и ежемесячные траты.
4. При желании добавьте ожидаемую доходность.
5. Нажмите кнопку расчета и посмотрите результат.

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

### Quick Start

```bash
pnpm install
pnpm dev
```

After startup, open the local address shown by Vite in the terminal. In most cases it is `http://localhost:5173`.

### How To Use

1. Enter your savings goal.
2. Choose the date you want to reach it by.
3. Fill in your income and monthly expenses.
4. Optionally add an expected interest rate.
5. Run the calculation and review the result.

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
