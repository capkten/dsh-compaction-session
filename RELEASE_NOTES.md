# 0.1.0 — DSH 0.2.1-rc.5 only

- Independent context capacity and compaction trigger; reserve output headroom.
- Inherit session reasoning for same-provider/model summaries.
- Surface automatic compaction failures instead of continuing to grow history.
- Shared settings for four bundled local presets and compatible SSH/Docker presets.

Download the `.tgz` asset and follow INSTALL.md. Do not use GitHub's source ZIP
as an npm installation package. No npm registry publication is required.

Validation: 23 compaction tests, 60 companion SSH tests, six isolated preset
checks and clean frozen reinstall passed on the maintainer's Windows environment.
Release CI checks build, syntax and packaging only: host-dependent integration
tests require the matching Desktop packages. Live provider/API and Electron UI
acceptance remain pending. Existing oversized histories may still fail to summarize.

This is a prerelease tied to rc.5, not a blanket compatibility claim for later DSH
versions. SSH/Docker requires the companion dsh-ssh provider-selection changes.
