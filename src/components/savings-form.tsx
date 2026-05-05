import type { ComponentType, ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  Calendar,
  DollarSign,
  BarChart3,
  Clock,
  PiggyBank
} from 'lucide-react'

import type { SavingsPlan } from '@/lib/savings'
import { formatCurrency } from '@/lib/savings'
import {
  SUMMARY_STATUS_STYLES,
  type DeadlinePreset,
  type SummaryStatus
} from '@/lib/savings-form'
import { cn } from '@/lib/utils'
import type { SavingsFormErrors, SavingsFormValues } from '@/lib/validation'

interface SavingsFormProps {
  values: SavingsFormValues
  errors: SavingsFormErrors
  todayDate: string
  deadlinePresets: Array<DeadlinePreset & { deadlineValue: string }>
  plan: SavingsPlan | null
  summaryStatus: SummaryStatus | null
  isSubmitDisabled: boolean
  onTargetAmountChange: (value: string) => void
  onDeadlineChange: (value: string) => void
  onIncomeChange: (value: string) => void
  onExpensesChange: (value: string) => void
  onInterestRateChange: (value: string) => void
  onSubmit: () => void
}

interface InputFieldProps {
  label: string
  placeholder: string
  value: string
  error?: string
  icon: ComponentType<{ className?: string }>
  leadingIcon: ComponentType<{ className?: string }>
  type?: 'text' | 'date'
  inputMode?: 'numeric' | 'decimal'
  pattern?: string
  min?: string
  note?: string
  children?: ReactNode
  onChange: (value: string) => void
}

function InputField({
  label,
  placeholder,
  value,
  error,
  icon: LabelIcon,
  leadingIcon: LeadingIcon,
  type = 'text',
  inputMode,
  pattern,
  min,
  note,
  children,
  onChange
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
        <LabelIcon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <LeadingIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          placeholder={placeholder}
          value={value}
          min={min}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full pl-12 pr-4 py-4 rounded-2xl text-lg font-medium text-slate-800 glass-input',
            type === 'text' && 'placeholder:text-slate-400',
            error && 'border border-red-300 focus:border-red-400'
          )}
        />
      </div>
      {children}
      {note && <p className="text-xs text-slate-400">{note}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

function SavingsSummary({
  plan,
  summaryStatus
}: {
  plan: SavingsPlan
  summaryStatus: SummaryStatus
}) {
  const styles = SUMMARY_STATUS_STYLES[summaryStatus]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('p-4 glass rounded-2xl border space-y-2', styles.containerClass)}
    >
      <div className={cn('text-sm', styles.labelClass)}>
        Свободных средств:{' '}
        <span className={cn('font-semibold', styles.valueClass)}>
          {formatCurrency(plan.disposableIncome)}
        </span>
      </div>
      <div className={cn('text-sm', styles.labelClass)}>
        Нужно вносить в месяц:{' '}
        <span className={cn('font-semibold', styles.valueClass)}>
          {formatCurrency(plan.monthlyContribution)}
        </span>
      </div>
      {plan.annualInterestRate > 0 && (
        <div className={cn('text-sm', styles.labelClass)}>
          Проценты помогут:{' '}
          <span className={cn('font-semibold', styles.valueClass)}>
            {formatCurrency(plan.totalInterest)}
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default function SavingsForm({
  values,
  errors,
  todayDate,
  deadlinePresets,
  plan,
  summaryStatus,
  isSubmitDisabled,
  onTargetAmountChange,
  onDeadlineChange,
  onIncomeChange,
  onExpensesChange,
  onInterestRateChange,
  onSubmit
}: SavingsFormProps) {
  return (
    <motion.div
      key="form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-800 mb-4">
          Калькулятор накоплений
        </h1>
        <p className="text-lg text-slate-500 max-w-lg mx-auto">
          Рассчитай сколько нужно вносить, чтобы достичь своей цели к сроку
        </p>
      </div>

      <div className="glass-strong rounded-3xl p-6 md:p-10 space-y-6">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-slate-800">Расскажи о своей цели</h2>
        </div>

        <InputField
          label="Сумма цели"
          placeholder="Например: 300000"
          value={values.targetAmount}
          error={errors.targetAmount}
          icon={DollarSign}
          leadingIcon={DollarSign}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={onTargetAmountChange}
        />

        <InputField
          label="К какому сроку"
          placeholder=""
          value={values.deadline}
          error={errors.deadline}
          icon={Calendar}
          leadingIcon={Clock}
          type="date"
          min={todayDate}
          onChange={onDeadlineChange}
        >
          <div className="flex flex-wrap gap-2 pt-1">
            {deadlinePresets.map((preset) => {
              const isActive = values.deadline === preset.deadlineValue

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onDeadlineChange(preset.deadlineValue)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:border-sky-300 hover:text-sky-700'
                  )}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </InputField>

        <InputField
          label="Ежемесячный доход"
          placeholder="Например: 80000"
          value={values.income}
          error={errors.income}
          icon={Wallet}
          leadingIcon={DollarSign}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={onIncomeChange}
        />

        <InputField
          label="Обязательные траты"
          placeholder="Например: 50000"
          value={values.expenses}
          error={errors.expenses}
          icon={BarChart3}
          leadingIcon={DollarSign}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={onExpensesChange}
        />

        <InputField
          label="Ставка по вкладу, % годовых"
          placeholder="Например: 16.5"
          value={values.interestRate}
          error={errors.interestRate}
          icon={PiggyBank}
          leadingIcon={TrendingUp}
          inputMode="decimal"
          note="Поле необязательное. Если пусто, проценты не учитываются."
          onChange={onInterestRateChange}
        />

        {plan && summaryStatus && <SavingsSummary plan={plan} summaryStatus={summaryStatus} />}

        <button
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="w-full glass-button text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <TrendingUp className="w-5 h-5" />
          Рассчитать план
        </button>
      </div>
    </motion.div>
  )
}
