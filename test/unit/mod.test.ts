import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.208.0/assert/mod.ts';
import { tools } from '../../mod.ts';
import type { PluginContext, ToolContext } from '../../types.ts';

// Mock PluginContext
const mockContext: PluginContext & ToolContext = {
  pluginId: 'cortex-plugin-meeting-transcriber',
  pluginDir: '/tmp/plugins/cortex-plugin-meeting-transcriber',
  state: {
    get: async () => null,
    set: async () => {},
    delete: async () => {},
    list: async () => ({}),
  },
  config: {
    get: async () => null,
    set: async () => {},
    getAll: async () => ({}),
  },
  logger: {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
  },
  host: {
    registerTool: () => {},
    unregisterTool: () => {},
  },
  sessionId: 'test-session',
  workingDir: '/tmp',
  agentId: 'test-agent',
  workspaceDir: '/tmp',
};

function findTool(name: string) {
  const tool = tools.find((t) => t.definition.name === name);
  if (!tool) throw new Error(`Tool "${name}" not found`);
  return tool;
}

Deno.test('tools array — exports all tools', () => {
  assertEquals(tools.length, 5);
  assertEquals(tools[0].definition.name, 'transcribe_audio');
  assertEquals(tools[1].definition.name, 'summarize_meeting');
  assertEquals(tools[2].definition.name, 'extract_action_items');
  assertEquals(tools[3].definition.name, 'meeting_search');
  assertEquals(tools[4].definition.name, 'transcribe_status');
});

Deno.test('transcribe_audio — rejects empty file_path', async () => {
  const tool = findTool('transcribe_audio');
  const result = await tool.execute({ 'file_path': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('summarize_meeting — rejects empty transcript', async () => {
  const tool = findTool('summarize_meeting');
  const result = await tool.execute({ 'transcript': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('extract_action_items — rejects empty transcript', async () => {
  const tool = findTool('extract_action_items');
  const result = await tool.execute({ 'transcript': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('meeting_search — rejects empty query', async () => {
  const tool = findTool('meeting_search');
  const result = await tool.execute({ 'query': '' }, mockContext);
  assertEquals(result.success, false);
  assertStringIncludes(result.error ?? '', 'non-empty string');
});

Deno.test('transcribe_status — tool is defined with name and description', () => {
  const tool = findTool('transcribe_status');
  assertEquals(typeof tool.definition.description, 'string');
  assertEquals(tool.definition.description.length > 0, true);
});

Deno.test('all tools return durationMs', async () => {
  for (const tool of tools) {
    const args: Record<string, unknown> = {};
    const result = await tool.execute(args, mockContext);
    assertEquals(typeof result.durationMs, 'number');
    assertEquals(result.durationMs >= 0, true);
  }
});
