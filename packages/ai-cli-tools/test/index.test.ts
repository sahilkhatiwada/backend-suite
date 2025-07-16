import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock OpenAI and file system
vi.mock('openai', () => ({
  OpenAI: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked OpenAI response' } }],
        }),
      },
    },
  })),
}));

vi.mock('fs');

const mockFileContent = 'function foo() { return 42; }';

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => mockFileContent);
});

describe('@backend-suite/ai-cli-tools CLI', () => {
  it('should print audit output', async () => {
    const { stdout } = await import('child_process').then(({ execSync }) => {
      return { stdout: execSync('node dist/index.js audit foo.js', { encoding: 'utf-8' }) };
    });
    expect(stdout).toContain('Mocked OpenAI response');
  });

  it('should print explain output', async () => {
    const { stdout } = await import('child_process').then(({ execSync }) => {
      return { stdout: execSync('node dist/index.js explain foo.js', { encoding: 'utf-8' }) };
    });
    expect(stdout).toContain('Mocked OpenAI response');
  });

  it('should print testgen output', async () => {
    const { stdout } = await import('child_process').then(({ execSync }) => {
      return { stdout: execSync('node dist/index.js testgen foo.js', { encoding: 'utf-8' }) };
    });
    expect(stdout).toContain('Mocked OpenAI response');
  });
}); 