# Development

Use Node.js >=22.19.0. Build with `npm run build`, check syntax with
`npm run check`, and package with `npm pack`. Commit both maintained `src/`
and generated `lib/` because DSH loads the latter.

Core packages are supplied by the matching DSH rc.5 host. Do not bundle a second
copy of Cordis or DSH core services into the plugin. The integration tests also
import `@deepseek-ai/dsh-session-projection@0.2.1-rc.5`; provide that package and
the declared peer dependencies in an isolated development environment before
running `npm test`. Some host packages may not be publicly available. A clean
public registry installation has not been verified. The original 23-test run
used packages extracted from the matching Desktop runtime.

Keep personal profiles, credentials, session logs, node_modules and deployment
backups outside this repository. Test deployment in an isolated Profile first.
The local preset definitions in cordis.patch.yml are specific to rc.5; review
them against upstream before changing supported versions.

SSH/Docker integration additionally requires a dsh-ssh version exposing
compactionProvider and compactionConfig. This package does not modify dsh-ssh.
