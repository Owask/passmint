import * as v from 'valibot'
import { describe, expect, it } from 'vitest'
import { FeaturedActionSchema } from '../../src/schema/featured-actions'

describe('FeaturedActionSchema', () => {
  it('accepts a valid action', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'view-benefits',
      type: 'membershipBenefits',
      url: 'https://example.com/benefits',
    })
    expect(r.success).toBe(true)
  })

  it('rejects a non-HTTPS url', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'x',
      type: 'y',
      url: 'http://example.com',
    })
    expect(r.success).toBe(false)
  })

  it('accepts a tel: url for the call type', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'support',
      type: 'call',
      url: 'tel:+94112345678',
    })
    expect(r.success).toBe(true)
  })

  it('rejects an https url for the call type', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'support',
      type: 'call',
      url: 'https://example.com/support',
    })
    expect(r.success).toBe(false)
    expect(r.issues?.[0]?.path?.[0]?.key).toBe('url')
  })

  it('rejects a tel: url for other types', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'benefits',
      type: 'membershipBenefits',
      url: 'tel:+94112345678',
    })
    expect(r.success).toBe(false)
  })

  it('rejects an empty identifier', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: '',
      type: 'y',
      url: 'https://example.com',
    })
    expect(r.success).toBe(false)
  })

  it('rejects an empty type', () => {
    const r = v.safeParse(FeaturedActionSchema, {
      identifier: 'x',
      type: '',
      url: 'https://example.com',
    })
    expect(r.success).toBe(false)
  })
})
