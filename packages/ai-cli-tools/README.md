# @backend-suite/ai-cli-tools

OpenAI-powered CLI for backend code audit, explanation, and testing.

## Purpose
Leverage GPT models to:
- Audit backend code for security and best practices
- Explain code, functions, or files
- Generate and run tests for backend code

## Features
- Command-line interface (CLI) for backend projects
- Supports code audit, explanation, and test generation
- Works with any backend codebase (TypeScript, JavaScript, etc.)
- Uses OpenAI API (GPT-4, GPT-3.5)

## Installation
```sh
pnpm install -g @backend-suite/ai-cli-tools
```

## Usage
```sh
ai-cli audit <file>
ai-cli explain <file|function>
ai-cli testgen <file>
```

## Configuration
Set your OpenAI API key as an environment variable:
```sh
export OPENAI_API_KEY=sk-...
```

## Example
```sh
ai-cli audit src/index.ts
ai-cli explain src/utils.ts
ai-cli testgen src/auth.ts
```

## License
MIT 