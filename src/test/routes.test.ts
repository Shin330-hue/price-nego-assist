import { describe, expect, it } from 'vitest'
import { isValidFieldId, ROUTES } from '../lib/routes'

describe('isValidFieldId', () => {
  it('既知の分野 ID は true', () => {
    expect(isValidFieldId('cutting')).toBe(true)
    expect(isValidFieldId('heat-treatment')).toBe(true)
  })

  it('未知 ID / undefined / null は false', () => {
    expect(isValidFieldId('unknown')).toBe(false)
    expect(isValidFieldId(undefined)).toBe(false)
    expect(isValidFieldId(null)).toBe(false)
    expect(isValidFieldId('')).toBe(false)
  })
})

describe('ROUTES', () => {
  it('パス生成が正しい', () => {
    expect(ROUTES.home).toBe('/')
    expect(ROUTES.field('cutting')).toBe('/fields/cutting')
    expect(ROUTES.sheet('cutting')).toBe('/fields/cutting/sheet')
    expect(ROUTES.sources).toBe('/sources')
    expect(ROUTES.about).toBe('/about')
  })
})
