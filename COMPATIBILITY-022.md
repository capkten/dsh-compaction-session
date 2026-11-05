# DSH 0.2.2-rc.1 compatibility verification (2026-11-05)

- Isolated runtime: exact official modules extracted from installed Desktop app.asar.
- 24 regression tests pass, including actual compaction checkpoints, independent capacity/threshold, session reasoning, concurrent sessions, and removed preset export contract.
- Installed dsh-ssh 0.4.4 removes the obsolete subagent-control/list-agents entry. The unified official plugin still provides list_agents.
- Installed dsh-compaction-session 0.1.1 declares the verified current runtime and removes the same obsolete entry from all three bundled presets. Compression implementation unchanged.
- Actual Desktop backend Web UI: original failing session a previously failing session returned agentAvailable=true; input editable. Second original failing history also editable.
- No messages sent, model calls or remote business commands executed during restoration verification. Native Electron UI not automated.
- Public memory dsh-projects 0.4.0 installed, real backend page opens. Imported notes remain pending review and are excluded from automatic context.
