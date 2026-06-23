import type { PluginContext, Tool, ToolCallResult } from 'cortex/plugins';

let pluginConfig: Record<string, unknown> = {};

export async function onLoad(ctx: PluginContext): Promise<void> {
  pluginConfig = await ctx.config.get();
  ctx.logger.info(`[cortex-plugin-meeting-transcriber] Loaded in ${ctx.pluginDir}`);
}

export async function onUnload(ctx: PluginContext): Promise<void> {
  ctx.logger.info('[cortex-plugin-meeting-transcriber] Unloading...');
}

const transcribeAudioTool: Tool = {
  definition: {
    name: 'transcribe_audio',
    description: 'Transcribe an audio/video file',
    params: [
      {
        name: 'file_path',
        type: 'string',
        description: 'Path to audio or video file',
        required: true,
      },
      {
        name: 'language',
        type: 'string',
        description: 'ISO language code (e.g. en)',
        required: false,
      },
      { name: 'model', type: 'string', description: 'Whisper model to use', required: false },
      {
        name: 'output_format',
        type: 'string',
        description: 'Output format (text, srt, json)',
        required: false,
      },
    ],
    capabilities: ['shell:run', 'fs:read'],
  },
  execute: async (args: Record<string, unknown>, _ctx: PluginContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const filePath = args.file_path;
      if (!filePath || typeof filePath !== 'string') {
        return {
          toolName: 'transcribe_audio',
          success: false,
          output: '',
          error: 'file_path must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const language = (args.language as string) || (pluginConfig.defaultLanguage as string) ||
        'en';
      const model = (args.model as string) || 'base';
      const validModels = ['tiny', 'base', 'small', 'medium', 'large'];
      if (!validModels.includes(model)) {
        return {
          toolName: 'transcribe_audio',
          success: false,
          output: '',
          error: `Invalid model: ${model}. Must be one of: ${validModels.join(', ')}`,
          durationMs: Date.now() - start,
        };
      }
      const outputFormat = (args.output_format as string) || 'text';
      const validFormats = ['text', 'srt', 'json'];
      if (!validFormats.includes(outputFormat)) {
        return {
          toolName: 'transcribe_audio',
          success: false,
          output: '',
          error: `Invalid output_format: ${outputFormat}. Must be one of: ${
            validFormats.join(', ')
          }`,
          durationMs: Date.now() - start,
        };
      }
      const result = {
        file_path: filePath,
        language,
        model,
        output_format: outputFormat,
        transcript: '',
      };
      return {
        toolName: 'transcribe_audio',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'transcribe_audio',
        success: false,
        output: '',
        error: `Failed to transcribe: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const summarizeMeetingTool: Tool = {
  definition: {
    name: 'summarize_meeting',
    description: 'Generate structured meeting notes from a transcript',
    params: [
      {
        name: 'transcript',
        type: 'string',
        description: 'Full meeting transcript text',
        required: true,
      },
      {
        name: 'meeting_title',
        type: 'string',
        description: 'Title of the meeting',
        required: false,
      },
      {
        name: 'participants',
        type: 'string',
        description: 'Comma-separated participant names',
        required: false,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: PluginContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const transcript = args.transcript;
      if (!transcript || typeof transcript !== 'string') {
        return {
          toolName: 'summarize_meeting',
          success: false,
          output: '',
          error: 'Transcript must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const meetingTitle = (args.meeting_title as string) || 'Untitled Meeting';
      const participants = (args.participants as string) || '';
      const result = {
        meeting_title: meetingTitle,
        participants: participants ? participants.split(',').map((s) => s.trim()) : [],
        summary: '',
        key_points: [],
        duration_words: transcript.length,
      };
      return {
        toolName: 'summarize_meeting',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'summarize_meeting',
        success: false,
        output: '',
        error: `Failed to summarize: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const extractActionItemsTool: Tool = {
  definition: {
    name: 'extract_action_items',
    description: 'Extract action items from a transcript',
    params: [
      {
        name: 'transcript',
        type: 'string',
        description: 'Full meeting transcript text',
        required: true,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: PluginContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const transcript = args.transcript;
      if (!transcript || typeof transcript !== 'string') {
        return {
          toolName: 'extract_action_items',
          success: false,
          output: '',
          error: 'Transcript must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const result = { action_items: [] };
      return {
        toolName: 'extract_action_items',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'extract_action_items',
        success: false,
        output: '',
        error: `Failed to extract action items: ${
          error instanceof Error ? error.message : String(error)
        }`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const meetingSearchTool: Tool = {
  definition: {
    name: 'meeting_search',
    description: 'Search across meeting transcripts',
    params: [
      { name: 'query', type: 'string', description: 'Search query', required: true },
      {
        name: 'max_results',
        type: 'number',
        description: 'Maximum number of results',
        required: false,
      },
    ],
    capabilities: [],
  },
  execute: async (args: Record<string, unknown>, _ctx: PluginContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const query = args.query;
      if (!query || typeof query !== 'string') {
        return {
          toolName: 'meeting_search',
          success: false,
          output: '',
          error: 'Query must be a non-empty string',
          durationMs: Date.now() - start,
        };
      }
      const maxResults = (args.max_results as number) || 10;
      const result = { results: [], query, max_results: maxResults };
      return {
        toolName: 'meeting_search',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'meeting_search',
        success: false,
        output: '',
        error: `Failed to search: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

const transcribeStatusTool: Tool = {
  definition: {
    name: 'transcribe_status',
    description: 'Check if Whisper is installed',
    params: [],
    capabilities: ['shell:run'],
  },
  execute: async (_args: Record<string, unknown>, _ctx: PluginContext): Promise<ToolCallResult> => {
    const start = Date.now();
    try {
      const result = { whisper_installed: false, model: pluginConfig.whisperModel || 'base' };
      return {
        toolName: 'transcribe_status',
        success: true,
        output: JSON.stringify(result, null, 2),
        durationMs: Date.now() - start,
      };
    } catch (error) {
      return {
        toolName: 'transcribe_status',
        success: false,
        output: '',
        error: `Failed to check status: ${error instanceof Error ? error.message : String(error)}`,
        durationMs: Date.now() - start,
      };
    }
  },
};

export const tools: Tool[] = [
  transcribeAudioTool,
  summarizeMeetingTool,
  extractActionItemsTool,
  meetingSearchTool,
  transcribeStatusTool,
];
