export interface SavingsFormValues {
  targetAmount: string
  deadline: string
  income: string
  expenses: string
  interestRate: string
}

export type SavingsFormField = keyof SavingsFormValues
export type SavingsFormErrors = Partial<Record<SavingsFormField, string>>

const INVALID_NUMBER_CHARS_REGEX = /\D+/g
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export function normalizeNonNegativeNumberInput(value: string): string {
  return value.replace(INVALID_NUMBER_CHARS_REGEX, '')
}

export function normalizePercentageInput(value: string): string {
  const sanitizedValue = value.replace(/[^\d.,]/g, '')
  const firstSeparatorIndex = sanitizedValue.search(/[.,]/)

  if (firstSeparatorIndex === -1) {
    return sanitizedValue
  }

  const integerPart = sanitizedValue.slice(0, firstSeparatorIndex).replace(/[.,]/g, '')
  const decimalPart = sanitizedValue.slice(firstSeparatorIndex + 1).replace(/[.,]/g, '')

  return `${integerPart}.${decimalPart}`
}

export function getTodayDateString(baseDate = new Date()): string {
  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, '0')
  const day = String(baseDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function validateSavingsForm(
  values: SavingsFormValues,
  todayDate = getTodayDateString()
): SavingsFormErrors {
  const errors: SavingsFormErrors = {}

  if (values.targetAmount) {
    const targetAmount = Number(values.targetAmount)

    if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
      errors.targetAmount = 'Сумма цели должна быть больше 0'
    }
  }

  if (values.income) {
    const income = Number(values.income)

    if (!Number.isFinite(income) || income < 0) {
      errors.income = 'Доход не может быть отрицательным'
    }
  }

  if (values.expenses) {
    const expenses = Number(values.expenses)

    if (!Number.isFinite(expenses) || expenses < 0) {
      errors.expenses = 'Траты не могут быть отрицательными'
    }
  }

  if (values.interestRate) {
    const interestRate = Number(values.interestRate)

    if (!Number.isFinite(interestRate) || interestRate < 0 || interestRate > 100) {
      errors.interestRate = 'Ставка должна быть числом от 0 до 100'
    }
  }

  if (values.deadline) {
    if (!ISO_DATE_REGEX.test(values.deadline)) {
      errors.deadline = 'Введите корректную дату'
    } else if (values.deadline < todayDate) {
      errors.deadline = 'Дата не может быть раньше сегодняшней'
    }
  }

  return errors
}
