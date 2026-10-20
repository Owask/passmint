// Packs packages/passmint with pnpm (which resolves `catalog:` versions), then
// renames it to the fork's package name and version and publishes with npm.
// Usage: node fork/scripts/publish.mjs [--dry-run]
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pkgDir = join(root, 'packages', 'passmint')
const fork = JSON.parse(readFileSync(join(root, 'fork', 'fork.json'), 'utf8'))
const dryRun = process.argv.includes('--dry-run')
const shell = process.platform === 'win32'
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit', shell })

const work = mkdtempSync(join(tmpdir(), 'passmint-fork-'))
try {
  run('pnpm', ['run', 'build'], pkgDir)
  run('pnpm', ['pack', '--pack-destination', work], pkgDir)
  const tarball = readdirSync(work).find((f) => f.endsWith('.tgz'))
  run('tar', ['-xzf', tarball], work)

  const staged = join(work, 'package')
  const manifestPath = join(staged, 'package.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const upstream = `${manifest.name}@${manifest.version}`
  manifest.name = fork.name
  manifest.version = fork.version
  manifest.description = `${manifest.description} TapAce fork of ${upstream}.`
  manifest.publishConfig = { access: 'public' }
  delete manifest.scripts
  delete manifest.devDependencies
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  run('npm', ['publish', '--tag', fork.tag, ...(dryRun ? ['--dry-run'] : [])], staged)
} finally {
  rmSync(work, { recursive: true, force: true })
}
