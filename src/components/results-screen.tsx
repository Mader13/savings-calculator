import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Target,
  PiggyBank,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

import type { SavingsPlan } from '@/lib/savings'
import { formatCurrency } from '@/lib/savings'

interface ResultsScreenProps {
  plan: SavingsPlan
  targetAmount: number
  onBack: () => void
  onReset: () => void
}

function formatPercentage(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}%`
}

function getProgressColor(progress: number): string {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const ratio = clampedProgress / 100
  const hue = 215 + (158 - 215) * ratio
  const saturation = 19 + (64 - 19) * ratio
  const lightness = 35 + (39 - 35) * ratio

  return `hsl(${hue} ${saturation}% ${lightness}%)`
}

export default function ResultsScreen({
  plan,
  targetAmount,
  onBack,
  onReset
}: ResultsScreenProps) {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null)
  const goalStatus = plan.isAchievable
    ? {
        title: 'Отличный прогресс - цель достижима',
        badge: 'Вы на верном пути',
        tone: 'emerald',
        icon: CheckCircle2,
        summary: (
          <>
            У вас уже достаточно свободных средств:{' '}
            <strong>{formatCurrency(plan.disposableIncome)}</strong> в месяц. При регулярных
            взносах <strong>{formatCurrency(plan.monthlyContribution)}</strong> в месяц цель{' '}
            <strong>{formatCurrency(plan.finalBalance)}</strong> вполне достижима.
          </>
        )
      }
    : {
        title: 'План требует корректировки',
        badge: 'Цель слишком большая',
        tone: 'amber',
        icon: AlertCircle,
        summary: (
          <>
            Нужно вносить <strong>{formatCurrency(plan.monthlyContribution)}</strong> в месяц, а
            свободно только <strong>{formatCurrency(plan.disposableIncome)}</strong>. Не хватает{' '}
            <strong>{formatCurrency(plan.shortfall)}</strong>.
          </>
        )
      }
  const GoalIcon = goalStatus.icon
  const bannerToneClass =
    goalStatus.tone === 'emerald'
      ? 'border-emerald-300/80 bg-emerald-50/70 text-emerald-900 shadow-emerald-900/10'
      : 'border-amber-300/80 bg-amber-50/75 text-amber-950 shadow-amber-900/10'
  const badgeToneClass =
    goalStatus.tone === 'emerald'
      ? 'border-emerald-200 bg-white/70 text-emerald-700'
      : 'border-amber-200 bg-white/70 text-amber-700'
  const strongToneClass =
    goalStatus.tone === 'emerald' ? '[&_strong]:text-emerald-600' : '[&_strong]:text-amber-700'

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <button
        onClick={onBack}
        className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 inline-flex items-center gap-2 hover:bg-white/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к данным
      </button>

      <section
        className={`relative overflow-hidden rounded-[28px] border p-5 shadow-2xl md:min-h-[188px] md:p-8 ${bannerToneClass}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.9),transparent_26%),linear-gradient(110deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.64)_47%,rgba(255,255,255,0.2)_100%)]" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
        <div className="relative z-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_310px] md:items-center">
          <div className="flex gap-4 md:gap-6">
            <div className="min-w-0 space-y-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight tracking-normal md:text-3xl">
                  {goalStatus.title}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${badgeToneClass}`}
                >
                  <GoalIcon className="h-4 w-4" />
                  {goalStatus.badge}
                </span>
              </div>
              <p
                className={`max-w-2xl text-base leading-7 text-slate-700 md:text-lg [&_strong]:font-bold ${strongToneClass}`}
              >
                {goalStatus.summary}
              </p>
            </div>
          </div>

          <div className="relative -mb-8 hidden h-52 self-end md:block">
            <img
              src="/banner.webp"
              alt=""
              className="absolute bottom-0 right-0 h-[260px] w-[260px] max-w-none object-contain"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-sm text-slate-500">Нужно вносить в месяц</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(plan.monthlyContribution)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{plan.monthsCount} месяцев</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-sm text-slate-500">Нужно вносить в неделю</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(plan.weeklyContribution)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{plan.weeksCount} недель</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <span className="text-sm text-slate-500">Нужно вносить в день</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(plan.dailyContribution)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{plan.daysCount} дней</p>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Итоги по вкладу</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-1">Ставка по вкладу</p>
            <p className="text-xl font-semibold text-slate-800">
              {formatPercentage(plan.annualInterestRate)}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-1">Своими взносами</p>
            <p className="text-xl font-semibold text-slate-800">
              {formatCurrency(plan.totalContribution)}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-1">Доход по процентам</p>
            <p className="text-xl font-semibold text-slate-800">
              {formatCurrency(plan.totalInterest)}
            </p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <p className="text-sm text-slate-500 mb-1">Итоговая сумма к сроку</p>
            <p className="text-xl font-semibold text-slate-800">
              {formatCurrency(plan.finalBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">
          Рост баланса по месяцам
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={plan.progressData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e232d" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1e232d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) => `${value / 1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null
                }

                const item = payload[0]
                  ?.payload as SavingsPlan['progressData'][number] | undefined

                if (!item) {
                  return null
                }

                return (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.6)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      padding: '12px 14px'
                    }}
                  >
                    <p className="text-sm font-medium text-slate-800 mb-2">{item.month}</p>
                    <p className="text-sm text-slate-600">
                      Баланс: {formatCurrency(item.balance)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Взнос: {formatCurrency(item.contribution)}
                    </p>
                    <p className="text-sm text-slate-600">
                      Проценты: {formatCurrency(item.interest)}
                    </p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#1e232d"
              strokeWidth={2}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-strong rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Детальный план по месяцам</h3>
        <div className="space-y-3">
          {plan.progressData.map((item, index) => {
            const progress = Math.round((item.balance / targetAmount) * 100)
            const progressWidth = Math.min((item.balance / targetAmount) * 100, 100)
            const remaining = Math.max(targetAmount - item.balance, 0)

            return (
              <motion.div
                key={`${item.month}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedMonth(expandedMonth === index ? null : index)}
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-medium text-slate-800">{item.month}</p>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <p className="text-xl font-bold text-slate-800">
                          {formatCurrency(item.balance)}
                        </p>
                        {expandedMonth === index ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Прогресс к цели</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressWidth}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getProgressColor(progressWidth) }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedMonth === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 space-y-4">
                        <div className="rounded-xl bg-white/55 p-4">
                          <p className="text-sm text-slate-500 mb-1">Нужно внести</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {formatCurrency(item.contribution)}
                          </p>
                        </div>

                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-white/70 bg-white/50 p-4">
                              <p className="text-sm text-slate-500 mb-1">Взнос за месяц</p>
                              <p className="text-lg font-semibold text-slate-800">
                                {formatCurrency(item.contribution)}
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/70 bg-white/50 p-4">
                              <p className="text-sm text-slate-500 mb-1">Проценты</p>
                              <p className="text-lg font-semibold text-slate-800">
                                {formatCurrency(item.interest)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-white/70 bg-white/50 p-4">
                              <p className="text-sm text-slate-500 mb-1">Внесено всего</p>
                              <p className="text-lg font-semibold text-slate-800">
                                {formatCurrency(item.cumulativeContribution)}
                              </p>
                            </div>
                            <div className="rounded-xl border border-white/70 bg-white/50 p-4">
                              <p className="text-sm text-slate-500 mb-1">Баланс</p>
                              <p className="text-lg font-semibold text-slate-800">
                                {formatCurrency(item.balance)}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 rounded-xl bg-slate-900/90 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm text-white/70">Осталось до цели</span>
                          <span className="text-lg font-semibold">{formatCurrency(remaining)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-3 pt-4 pb-8 sm:flex-row sm:items-center sm:justify-start">
        <button
          onClick={onBack}
          className="glass px-5 py-3 rounded-full text-sm font-medium text-slate-600 inline-flex items-center justify-center gap-2 hover:bg-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к данным
        </button>
        <button
          onClick={onReset}
          className="glass-button text-white px-5 py-3 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4" />
          Новый расчет
        </button>
      </div>
    </motion.div>
  )
}
