# Session compaction for DSH Desktop rc.5

[中文说明](README.zh.md) · [Installation / 安装步骤](INSTALL.md) · [Releases](https://github.com/capkten/dsh-compaction-session/releases)

This local plugin derives from the MIT-licensed official `@deepseek-ai/dsh-compaction-basic` 0.2.1-rc.5 implementation. It is limited to that Desktop release. It does not replace or bundle host core services.

Download the versioned `.tgz` from Releases and follow INSTALL.md. This is a
prerelease: controlled integration tests passed, while live provider and Electron
UI acceptance remain pending. No npm registry publication is currently provided.

## Configuration

Two capacities are configured independently:

- Model adapter `contextWindow`: total model context, including reserved output.
- Compaction provider `thresholdTokens`: estimated input pressure at which automatic compaction begins. Omit it to retain the official 80% rule.

Example (decimal tokens, not Ki tokens):

```yaml
- id: llm-pi-ai
  config:
    providers:
      my-provider:
        models:
          - id: my-model
            contextWindow: 272000
            maxTokens: 8192
- id: session-compaction-settings
  config:
    thresholdTokens: 256000
    headroomTokens: 1024
    maxTokens: 8192
```

The adapter example is a fragment, not a full replacement for your providers configuration. Preserve all other credentials, models and provider settings. Confirm the actual provider supports the chosen capacity.

The effective threshold is `min(thresholdTokens, contextWindow - max(conversation output cap, summary output cap) - headroomTokens)`. A threshold at or above context capacity is rejected; retention must be below the effective threshold. Without `thresholdTokens`, the normal ratio applies. Exact `modelPolicies` can override the threshold independently for each provider/model. Pressure logs state model capacity, configured threshold and effective threshold.

For mixed model capacities, prefer a policy for the specific model rather than
setting a global absolute threshold:

```yaml
- id: session-compaction-settings
  config:
    modelPolicies:
      - provider: my-provider
        model: my-model
        thresholdTokens: 256000
        headroomTokens: 1024
        maxTokens: 8192
```

The summary inherits the latest durable conversation request's reasoning effort only when provider and model match the summary target. A separately selected summary model retains its own defaults. Failed automatic compaction stops the next step with `COMPACTION_FAILED` and the actual cause; it does not silently grow the history further. Existing overflow recovery and file/tool balancing remain in place. Fixing the trigger does not guarantee recovery of a history that already exceeds the summary model's capacity. Large single tool outputs can still overshoot estimates between checks.

## SSH and Docker presets

The dsh-ssh `fix/session-compaction-config` branch adds optional aggregate settings:

```yaml
- id: ssh-remote
  config:
    compactionProvider: dsh-compaction-session
    # Shares session-compaction-settings; compactionConfig is an optional per-preset override.
```

Without these fields SSH uses the official engine. Each remote preset has its own engine and deep copy of configuration. The bundle remounts the four shipped local presets with the custom provider; their original tools and isolation are preserved. All custom engines inherit the root `session-compaction-settings` row. Add this package to the profile's bundle list so its runtime dependency closure is registered.

## Verification and deployment

`node scripts/build.mjs` copies the maintained source to `lib`; `node --check src/index.js` checks syntax. `node --test tests/repair.test.mjs` uses the extracted rc.5 host packages and a scripted LLM adapter. Tests cover real session compaction, reasoning, independent budgets, output reservations, invalid settings and visible failure. They do not constitute live vendor/API or Desktop UI acceptance.

Install the versioned tarball through the profile manifest and lockfile after completely exiting DSH. Back up manifest, patch and lockfile first. Do not edit app.asar or a live node_modules tree. Reinstalling from the pinned tarball preserves the repair. A future DSH update requires a new compatibility review.
