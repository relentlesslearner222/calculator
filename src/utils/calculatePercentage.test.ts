import { calculatePercentage } from './calculatePercentage'

describe('calculatePercentage', () => {
  it('returns correct percentage for standard values', () => {
    expect(calculatePercentage(25, 200)).toBe('12.5%')
  })

  it('returns 100% when part equals whole', () => {
    expect(calculatePercentage(5, 5)).toBe('100%')
  })

  it('returns 0% when part is 0', () => {
    expect(calculatePercentage(0, 200)).toBe('0%')
  })

  it('rounds to at most 2 decimal places and strips trailing zeros', () => {
    expect(calculatePercentage(1, 3)).toBe('33.33%')
  })

  it('returns error string when whole is 0', () => {
    expect(calculatePercentage(10, 0)).toBe('Cannot divide by zero')
  })

  it('returns error string when both part and whole are 0', () => {
    expect(calculatePercentage(0, 0)).toBe('Cannot divide by zero')
  })

  it('handles decimal part values', () => {
    expect(calculatePercentage(1.5, 10)).toBe('15%')
  })

  it('handles values that produce exact 2 decimal places', () => {
    expect(calculatePercentage(1, 7)).toBe('14.29%')
  })
})
