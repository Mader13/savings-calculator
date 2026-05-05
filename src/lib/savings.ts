export interface SavingsProgressItem {
  month: string
  contribution: number
  interest: number
  cumulativeContribution: number
  balance: number
}

export interface SavingsPlan {
  monthlyContribution: number
  weeklyContribution: number
  dailyContribution: number
  monthsCount: number
  weeksCount: number
  daysCount: number
  disposableIncome: number
  isAchievable: boolean
  shortfall: number
  annualInterestRate: number
  monthlyInterestRate: number
  totalContribution: number
  totalInterest: number
  finalBalance: number
  progressData: SavingsProgressItem[]
}

function calculateMonthlyContribution(
  targetAmount: number,
  monthsCount: number,
  monthlyInterestRate: number
): number {
  if (monthlyInterestRate === 0) {
    return targetAmount / monthsCount
  }

  return targetAmount / (((1 + monthlyInterestRate) ** monthsCount - 1) / monthlyInterestRate)
}

function formatMonthName(date: Date): string {
  const month = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

  return month.charAt(0).toUpperCase() + month.slice(1)
}

export function calculateSavingsPlan(
  targetAmount: number,
  deadline: string,
  income: number,
  expenses: number,
  annualInterestRate: number
): SavingsPlan {
  const now = new Date()
  const targetDate = new Date(deadline)
  const diffTime = targetDate.getTime() - now.getTime()
  const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  const weeksCount = Math.max(1, Math.ceil(daysCount / 7))
  const monthsCount = Math.max(1, Math.ceil(daysCount / 30))
  const monthlyInterestRate = annualInterestRate / 100 / 12
  const monthlyContribution = calculateMonthlyContribution(
    targetAmount,
    monthsCount,
    monthlyInterestRate
  )
  const totalContribution = monthlyContribution * monthsCount
  const weeklyContribution = totalContribution / weeksCount
  const dailyContribution = totalContribution / daysCount
  const disposableIncome = income - expenses
  const isAchievable = disposableIncome >= monthlyContribution
  const shortfall = isAchievable ? 0 : monthlyContribution - disposableIncome

  const progressData: SavingsProgressItem[] = []
  let balance = 0
  let cumulativeContribution = 0

  for (let i = 1; i <= monthsCount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const interest = balance * monthlyInterestRate
    balance = balance + interest + monthlyContribution
    cumulativeContribution += monthlyContribution

    progressData.push({
      month: formatMonthName(date),
      contribution: monthlyContribution,
      interest,
      cumulativeContribution,
      balance
    })
  }

  const finalBalance = balance
  const totalInterest = finalBalance - totalContribution

  return {
    monthlyContribution,
    weeklyContribution,
    dailyContribution,
    monthsCount,
    weeksCount,
    daysCount,
    disposableIncome,
    isAchievable,
    shortfall,
    annualInterestRate,
    monthlyInterestRate,
    totalContribution,
    totalInterest,
    finalBalance,
    progressData
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value)
}
