import type { SavingsPlan } from './savings'

export type SummaryStatus = 'danger' | 'warning' | 'success'
export type DeadlinePresetUnit = 'months' | 'years'

export interface DeadlinePreset {
  label: string
  value: number
  unit: DeadlinePresetUnit
}

export const SUMMARY_SUCCESS_THRESHOLD = 27000

export const DEADLINE_PRESETS: DeadlinePreset[] = [
  { label: '3 месяца', value: 3, unit: 'months' },
  { label: '6 месяцев', value: 6, unit: 'months' },
  { label: '1 год', value: 1, unit: 'years' },
  { label: '3 года', value: 3, unit: 'years' },
  { label: '5 лет', value: 5, unit: 'years' }
]

export const SUMMARY_STATUS_STYLES: Record<
  SummaryStatus,
  {
    containerClass: string
    labelClass: string
    valueClass: string
  }
> = {
  danger: {
    containerClass: 'bg-red-50/70 border-red-200/70',
    labelClass: 'text-red-800',
    valueClass: 'text-red-900'
  },
  warning: {
    containerClass: 'bg-amber-50/75 border-amber-200/75',
    labelClass: 'text-amber-800',
    valueClass: 'text-amber-900'
  },
  success: {
    containerClass: 'bg-emerald-50/75 border-emerald-200/75',
    labelClass: 'text-emerald-800',
    valueClass: 'text-emerald-900'
  }
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function getPresetDeadline(baseDate: Date, preset: DeadlinePreset) {
  const dayOfMonth = baseDate.getDate()

  if (preset.unit === 'months') {
    const targetMonthIndex = baseDate.getMonth() + preset.value
    const targetYear = baseDate.getFullYear() + Math.floor(targetMonthIndex / 12)
    const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12
    const targetDay = Math.min(dayOfMonth, getDaysInMonth(targetYear, normalizedMonth))

    return new Date(targetYear, normalizedMonth, targetDay)
  }

  const targetYear = baseDate.getFullYear() + preset.value
  const targetMonth = baseDate.getMonth()
  const targetDay = Math.min(dayOfMonth, getDaysInMonth(targetYear, targetMonth))

  return new Date(targetYear, targetMonth, targetDay)
}

export function getSummaryStatus(plan: SavingsPlan): SummaryStatus {
  const savingsDifference = plan.disposableIncome - plan.monthlyContribution

  if (plan.disposableIncome < plan.monthlyContribution) {
    return 'danger'
  }

  return savingsDifference > SUMMARY_SUCCESS_THRESHOLD ? 'success' : 'warning'
}
