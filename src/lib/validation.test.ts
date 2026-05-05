import { describe, expect, it } from 'vitest'

import {
  normalizePercentageInput,
  validateSavingsForm,
  type SavingsFormValues
} from './validation'

function createFormValues(overrides: Partial<SavingsFormValues> = {}): SavingsFormValues {
  return {
    targetAmount: '300000',
    deadline: '2026-04-01',
    income: '100000',
    expenses: '40000',
    interestRate: '',
    ...overrides
  }
}

describe('normalizePercentageInput', () => {
  it('keeps only digits and one decimal separator', () => {
    expect(normalizePercentageInput('12,5')).toBe('12.5')
    expect(normalizePercentageInput('16.5%')).toBe('16.5')
    expect(normalizePercentageInput('1,2,3')).toBe('1.23')
  })
})

describe('validateSavingsForm', () => {
  it('accepts empty interest rate', () => {
    const errors = validateSavingsForm(createFormValues())

    expect(errors.interestRate).toBeUndefined()
  })

  it('accepts valid interest rates', () => {
    expect(validateSavingsForm(createFormValues({ interestRate: '0' })).interestRate).toBeUndefined()
    expect(
      validateSavingsForm(createFormValues({ interestRate: '16.5' })).interestRate
    ).toBeUndefined()
    expect(
      validateSavingsForm(createFormValues({ interestRate: normalizePercentageInput('12,5') }))
        .interestRate
    ).toBeUndefined()
  })

  it('rejects interest rate below zero', () => {
    const errors = validateSavingsForm(createFormValues({ interestRate: '-1' }))

    expect(errors.interestRate).toBe('Ставка должна быть числом от 0 до 100')
  })

  it('rejects interest rate above one hundred', () => {
    const errors = validateSavingsForm(createFormValues({ interestRate: '101' }))

    expect(errors.interestRate).toBe('Ставка должна быть числом от 0 до 100')
  })
})
