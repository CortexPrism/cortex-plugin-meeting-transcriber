# Changelog

## [Unreleased]

### Changed
- Renamed manifest file from `cortex.json` to `manifest.json` for consistency with Cortex standard
- Standardized UI section structure to `ui.settings` format
- Normalized parameter naming: `defaultValue` → `default`, `options` → `enum`
- Added `homepage` field with repository URL
- Added `dependencies` field to manifest

### Fixed
- Replaced `console.log` with `ctx.logger.info()` in lifecycle hooks

## [1.0.1] — 2026-06-15

### Added
- Initial release
## [1.0.1] — 2026-06-17

### Added

- Initial project setup

## [1.0.0] — 2026-06-15

### Added

- Initial release of cortex-plugin-meeting-transcriber
- `transcribe_audio` tool — Transcribe audio/video via Whisper
- `summarize_meeting` tool — Generate structured meeting notes
- `extract_action_items` tool — Extract action items from transcripts
- `meeting_search` tool — Search across meeting transcripts
- `transcribe_status` tool — Check Whisper installation status
