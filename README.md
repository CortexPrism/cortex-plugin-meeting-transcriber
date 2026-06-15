# cortex-plugin-meeting-transcriber

Ingest audio/video files, transcribe via Whisper, generate structured meeting notes.

## Installation

```bash
cortex plugin install marketplace:cortex-plugin-meeting-transcriber
cortex plugin install github:CortexPrism/cortex-plugin-meeting-transcriber
cortex plugin install ./manifest.json
```

## Tools

### transcribe_audio

Transcribe an audio/video file.

**Parameters:**
- `file_path` (string, required) — Path to audio or video file
- `language` (string, optional) — ISO language code (e.g. "en")
- `model` (string, optional, default "base") — tiny, base, small, medium, large
- `output_format` (string, optional, default "text") — text, srt, json

### summarize_meeting

Generate structured meeting notes from a transcript.

**Parameters:**
- `transcript` (string, required) — Full meeting transcript
- `meeting_title` (string, optional) — Title of the meeting
- `participants` (string, optional) — Comma-separated names

### extract_action_items

Extract action items from a transcript.

**Parameters:**
- `transcript` (string, required) — Full meeting transcript

### meeting_search

Search across meeting transcripts.

**Parameters:**
- `query` (string, required) — Search query
- `max_results` (number, optional, default 10) — Maximum results

### transcribe_status

Check if Whisper is installed.

## Configuration

```json
{
  "plugins": {
    "cortex-plugin-meeting-transcriber": {
      "enabled": true,
      "config": {
        "whisperModel": "base",
        "defaultLanguage": "en"
      }
    }
  }
}
```

## Capabilities

- `tools` — Provides tool implementations
- `shell:run` — Runs Whisper CLI
- `fs:read` — Reads audio/video files

## License

MIT — See LICENSE file
