import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { calculateSavingsPlan } from './savings'

describe('calculateSavingsPlan', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps old behavior when interest rate is zero', () => {
    const plan = calculateSavingsPlan(300000, '2026-04-01', 100000, 40000, 0)

    expect(plan.monthlyContribution * plan.monthsCount).toBeCloseTo(300000, 6)
    expect(plan.totalContribution).toBeCloseTo(300000, 6)
    expect(plan.totalInterest).toBeCloseTo(0, 6)
    expect(plan.finalBalance).toBeCloseTo(300000, 6)
  })

  it('reduces monthly contribution when rate is positive', () => {
    const basePlan = calculateSavingsPlan(300000, '2026-04-01', 100000, 40000, 0)
    const interestPlan = calculateSavingsPlan(300000, '2026-04-01', 100000, 40000, 12)

    expect(interestPlan.monthlyContribution).toBeLessThan(basePlan.monthlyContribution)
    expect(interestPlan.finalBalance).toBeCloseTo(300000, 6)
    expect(interestPlan.totalInterest).toBeGreaterThan(0)
  })

  it('keeps one month minimum for short term deadlines', () => {
    const plan = calculateSavingsPlan(300000, '2026-01-15', 100000, 40000, 10)

    expect(plan.monthsCount).toBe(1)
    expect(plan.progressData).toHaveLength(1)
    expect(plan.finalBalance).toBeGreaterThan(0)
  })

  it('formats progress month with year', () => {
    const plan = calculateSavingsPlan(300000, '2026-04-01', 100000, 40000, 0)

    expect(plan.progressData[0].month).toBe('Февраль 2026 г.')
  })

  it('marks plan as not achievable when no free money left', () => {
    const plan = calculateSavingsPlan(300000, '2026-04-01', 50000, 50000, 0)

    expect(plan.disposableIncome).toBe(0)
    expect(plan.isAchievable).toBe(false)
    expect(plan.shortfall).toBeGreaterThan(0)
  })
})
