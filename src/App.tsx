import { lazy, Suspense, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import './App.css'
import SavingsForm from './components/savings-form'
import { calculateSavingsPlan } from './lib/savings'
import {
  DEADLINE_PRESETS,
  getPresetDeadline,
  getSummaryStatus,
  type SummaryStatus
} from './lib/savings-form'
import { cn } from './lib/utils'
import {
  getTodayDateString,
  normalizeNonNegativeNumberInput,
  normalizePercentageInput,
  type SavingsFormErrors,
  type SavingsFormField,
  type SavingsFormValues,
  validateSavingsForm
} from './lib/validation'

type RequiredSavingsField = Exclude<SavingsFormField, 'interestRate'>

const ResultsScreen = lazy(() => import('./components/results-screen'))

const REQUIRED_FIELD_MESSAGES: Record<RequiredSavingsField, string> = {
  targetAmount: 'Введите сумму цели',
  deadline: 'Выберите дату',
  income: 'Введите доход',
  expenses: 'Введите траты'
}

const INITIAL_FORM_VALUES: SavingsFormValues = {
  targetAmount: '',
  deadline: '',
  income: '',
  expenses: '',
  interestRate: ''
}

function getFieldErrors(
  formValues: SavingsFormValues,
  validationErrors: SavingsFormErrors,
  submitAttempted: boolean
): SavingsFormErrors {
  const fields: SavingsFormField[] = [
    'targetAmount',
    'deadline',
    'income',
    'expenses',
    'interestRate'
  ]

  return fields.reduce<SavingsFormErrors>((errors, field) => {
    if (validationErrors[field]) {
      errors[field] = validationErrors[field]
      return errors
    }

    if (field !== 'interestRate' && submitAttempted && !formValues[field]) {
      errors[field] = REQUIRED_FIELD_MESSAGES[field]
    }

    return errors
  }, {})
}

export default function App() {
  const [screen, setScreen] = useState<'form' | 'results'>('form')
  const [formValues, setFormValues] = useState<SavingsFormValues>(INITIAL_FORM_VALUES)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const todayDate = useMemo(() => getTodayDateString(), [])
  const deadlinePresetDates = useMemo(() => {
    const baseDate = new Date(todayDate)

    return DEADLINE_PRESETS.map((preset) => ({
      ...preset,
      deadlineValue: getTodayDateString(getPresetDeadline(baseDate, preset))
    }))
  }, [todayDate])

  const validationErrors = useMemo(
    () => validateSavingsForm(formValues, todayDate),
    [formValues, todayDate]
  )
  const fieldErrors = useMemo(
    () => getFieldErrors(formValues, validationErrors, submitAttempted),
    [formValues, submitAttempted, validationErrors]
  )
  const allFilled = [
    formValues.targetAmount,
    formValues.deadline,
    formValues.income,
    formValues.expenses
  ].every(Boolean)
  const hasValidationErrors = Object.keys(validationErrors).length > 0

  const plan = useMemo(() => {
    if (!allFilled || hasValidationErrors) {
      return null
    }

    return calculateSavingsPlan(
      Number(formValues.targetAmount),
      formValues.deadline,
      Number(formValues.income),
      Number(formValues.expenses),
      Number(formValues.interestRate || 0)
    )
  }, [allFilled, formValues, hasValidationErrors])

  const summaryStatus: SummaryStatus | null = useMemo(() => {
    if (!plan) {
      return null
    }

    return getSummaryStatus(plan)
  }, [plan])

  const setFormValue = (field: keyof SavingsFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value
    }))
  }

  const handleNumberChange = (field: keyof SavingsFormValues, value: string) => {
    setFormValue(field, normalizeNonNegativeNumberInput(value))
  }

  const handleCalculate = () => {
    setSubmitAttempted(true)

    if (allFilled && !hasValidationErrors) {
      setScreen('results')
    }
  }

  const handleBack = () => {
    setScreen('form')
  }

  const handleReset = () => {
    setScreen('form')
    setFormValues(INITIAL_FORM_VALUES)
    setSubmitAttempted(false)
  }

  return (
    <div
      className={cn(
        'relative w-full bg-white',
        screen === 'form' ? 'min-h-screen overflow-hidden' : 'min-h-screen'
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div
        className={cn(
          'relative z-10 max-w-5xl mx-auto px-4',
          screen === 'form' ? 'h-full flex items-center justify-center py-4 md:py-6' : 'py-8 md:py-16'
        )}
      >
        <AnimatePresence mode="wait">
          {screen === 'form' && (
            <SavingsForm
              values={formValues}
              errors={fieldErrors}
              todayDate={todayDate}
              deadlinePresets={deadlinePresetDates}
              plan={plan}
              summaryStatus={summaryStatus}
              isSubmitDisabled={!allFilled || hasValidationErrors}
              onTargetAmountChange={(value) => handleNumberChange('targetAmount', value)}
              onDeadlineChange={(value) => setFormValue('deadline', value)}
              onIncomeChange={(value) => handleNumberChange('income', value)}
              onExpensesChange={(value) => handleNumberChange('expenses', value)}
              onInterestRateChange={(value) =>
                setFormValue('interestRate', normalizePercentageInput(value))
              }
              onSubmit={handleCalculate}
            />
          )}

          {screen === 'results' && plan && (
            <Suspense
              fallback={
                <motion.div
                  key="results-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-5xl mx-auto"
                >
                  <div className="glass-strong rounded-3xl p-6 md:p-8 text-slate-500">
                    Загружаю расчёт...
                  </div>
                </motion.div>
              }
            >
              <ResultsScreen
                plan={plan}
                targetAmount={Number(formValues.targetAmount)}
                onBack={handleBack}
                onReset={handleReset}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
