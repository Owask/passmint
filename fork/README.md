# TapAce fork of passmint

Branch `tapace` is upstream [getpassmint/passmint](https://github.com/getpassmint/passmint)
plus the changes below. It is published to npm as `@owask/passmint`. The source package
keeps the name `passmint`, so the workspace and upstream merges are unaffected. Only
`fork/scripts/publish.mjs` renames it, inside the published tarball.

Based on upstream `5e605a1` (passmint 0.7.0).

## Changes from upstream

All additive: a pass that uses none of them renders exactly as upstream.

| Change | Files |
|---|---|
| `images.primaryLogo` → `primaryLogo.png`. The iOS 27 poster shows this logo, not `logo.png` (verified on device, 2026-10-20). Apple-only. | `src/schema/images.ts`, `src/apple/render.ts` |
| `posterFields` on generic passes (`headerFields` ≤1, `primaryFields` ≤4, `footerFields` ≤1, `additionalInfoFields`, `backFields`). When set, `posterGeneric` is built only from it, so the poster and the `generic` fallback can be arranged separately. Limits are what Wallet showed on an iOS 27 iPhone. | `src/schema/pass.ts`, `src/apple/render.ts`, `src/pass.ts` (`.posterField(area, field)`), type exports |
| Featured Action `call` takes a `tel:` link, the only form Wallet shows (verified on device). All other types stay HTTPS-only. | `src/schema/featured-actions.ts` |
| `poster` / `posterFields` on event tickets: `posterGeneric` beside the `eventTicket` block, with the art in the new `images.artwork` (`artwork.png`), since `background.png` is the event ticket's own background (verified on device, 2026-10-21). | `src/schema/pass.ts`, `src/schema/images.ts`, `src/apple/render.ts` |
| Fork publishing | `fork/` |

## Merging an upstream release

```bash
git remote add upstream https://github.com/getpassmint/passmint.git
git fetch upstream
git checkout tapace
git merge upstream/main
```

Resolve conflicts, then run the checks below. Then set `fork/fork.json` `version` to
`<upstream version>-tapace.1` (for example `0.8.0-tapace.1`), and update the base commit above.

## Checks

On Linux or in CI (the signing tests need `/bin/bash` and `openssl`):

```bash
pnpm install --frozen-lockfile
pnpm --filter passmint test
pnpm --filter passmint type-check
pnpm lint
```

## Publishing

Log in to npm as an owner of the `@owask` scope, bump `fork/fork.json` `version`
(`-tapace.2`, …), then:

```bash
node fork/scripts/publish.mjs --dry-run
node fork/scripts/publish.mjs
```
