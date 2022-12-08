// @ts-check

import { riskScoreLetter } from '@/models/riskModels'

describe('riskScoreLetter', () => {
  it('should throw an error if score is out of range', () => {
    expect(() => riskScoreLetter(11, true, false)).toThrow()
    expect(() => riskScoreLetter(11, false, true)).toThrow()
  })

  it('should returns A', () => {
    expect(riskScoreLetter(0, false, true)).toBe('A')
    expect(riskScoreLetter(0, true, false)).toBe('A')
  })

  it('should returns B', () => {
    expect(riskScoreLetter(0.1, false, true)).toBe('B')
    expect(riskScoreLetter(1, true, false)).toBe('B')
    expect(riskScoreLetter(3, false, true)).toBe('B')
    expect(riskScoreLetter(3.9, true, false)).toBe('B')
  })

  it('should returns C', () => {
    expect(riskScoreLetter(4, false, true)).toBe('C')
    expect(riskScoreLetter(5, true, false)).toBe('C')
    expect(riskScoreLetter(6.9, true, false)).toBe('C')
  })

  it('should returns D', () => {
    expect(riskScoreLetter(7, false, true)).toBe('D')
    expect(riskScoreLetter(8, true, false)).toBe('D')
    expect(riskScoreLetter(8.9, true, false)).toBe('D')
  })

  it('should returns E', () => {
    expect(riskScoreLetter(9, false, true)).toBe('E')
    expect(riskScoreLetter(9.5, true, false)).toBe('E')
    expect(riskScoreLetter(10, true, false)).toBe('E')
  })

  it('should returns F', () => {
    // Not scanned and no vuln:
    expect(riskScoreLetter(0, false, false)).toBe('F')
    expect(riskScoreLetter(-154, false, false)).toBe('F')
    expect(riskScoreLetter(21, false, false)).toBe('F')
    // If no score given:
    expect(riskScoreLetter(null, false, true)).toBe('F')
    expect(riskScoreLetter(null, true, false)).toBe('F')
    expect(riskScoreLetter(-1, true, false)).toBe('F')
    expect(riskScoreLetter(-1, false, true)).toBe('F')
  })
})
