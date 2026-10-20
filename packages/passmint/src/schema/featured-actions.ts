import * as v from 'valibot'

/**
 * A featured action: a tappable button shown below the pass face (iOS 27+).
 * A pass may declare up to two. Apple-only — Google has no equivalent and
 * ignores these. Older iOS ignores the unknown `featuredActions` key.
 *
 * `type` is an open string rather than a closed enum: Apple's full set of
 * action types is not publicly enumerated, and a closed list would force a
 * release each time Apple adds one. Known values include `membershipBenefits`
 * and `viewMembership`.
 */
export const FeaturedActionSchema = v.pipe(
  v.object({
    /** Stable, unique identifier for the action within the pass. */
    identifier: v.pipe(v.string(), v.minLength(1)),
    /** Action type, e.g. `membershipBenefits`, `viewMembership`. */
    type: v.pipe(v.string(), v.minLength(1)),
    /**
     * Link opened when the action is tapped. HTTPS, except the `call` type,
     * which Wallet only shows with a `tel:` link (verified on an iOS 27 device).
     */
    url: v.pipe(v.string(), v.url()),
  }),
  v.forward(
    v.partialCheck(
      [['type'], ['url']],
      (action) => new URL(action.url).protocol === (action.type === 'call' ? 'tel:' : 'https:'),
      'URL must use https:// scheme (tel: for the call type)',
    ),
    ['url'],
  ),
)

export type FeaturedAction = v.InferOutput<typeof FeaturedActionSchema>
