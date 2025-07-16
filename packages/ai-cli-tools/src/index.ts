#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const program = new Command();
program.name('ai-cli').description('OpenAI-powered backend CLI tools').version('0.1.0');

function readFileOrExit(file: string): string {
  try {
    return fs.readFileSync(path.resolve(file), 'utf-8');
  } catch (err) {
    console.error(`Error reading file: ${file}`);
    process.exit(1);
  }
}

async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY environment variable.');
    process.exit(1);
  }
  const openai = new OpenAI({ apiKey });
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });
    return chat.choices[0]?.message?.content?.trim() || '[No response]';
  } catch (err: any) {
    return `OpenAI API error: ${err.message}`;
  }
}

program
  .command('audit <file>')
  .description('Audit backend code for security and best practices')
  .action(async (file) => {
    const code = readFileOrExit(file);
    const prompt = `Audit this backend code for security and best practices:\n\n${code}`;
    const systemPrompt = 'You are a backend code security and best practices auditor.';
    const result = await callOpenAI(prompt, systemPrompt);
    console.log(result);
  });

program
  .command('explain <file>')
  .description('Explain code, functions, or files')
  .action(async (file) => {
    const code = readFileOrExit(file);
    const prompt = `Explain the following backend code in detail:\n\n${code}`;
    const systemPrompt = 'You are a senior backend engineer who explains code clearly.';
    const result = await callOpenAI(prompt, systemPrompt);
    console.log(result);
  });

program
  .command('testgen <file>')
  .description('Generate tests for backend code')
  .action(async (file) => {
    const code = readFileOrExit(file);
    const prompt = `Generate comprehensive tests for this backend code:\n\n${code}`;
    const systemPrompt = 'You are a backend test engineer who writes robust, idiomatic tests.';
    const result = await callOpenAI(prompt, systemPrompt);
    console.log(result);
  });

program.parseAsync(process.argv); 