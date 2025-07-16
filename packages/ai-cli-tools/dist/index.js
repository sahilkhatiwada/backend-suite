#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_openai = require("openai");
var program = new import_commander.Command();
program.name("ai-cli").description("OpenAI-powered backend CLI tools").version("0.1.0");
function readFileOrExit(file) {
  try {
    return import_fs.default.readFileSync(import_path.default.resolve(file), "utf-8");
  } catch (err) {
    console.error(`Error reading file: ${file}`);
    process.exit(1);
  }
}
async function callOpenAI(prompt, systemPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY environment variable.");
    process.exit(1);
  }
  const openai = new import_openai.OpenAI({ apiKey });
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1024
    });
    return chat.choices[0]?.message?.content?.trim() || "[No response]";
  } catch (err) {
    return `OpenAI API error: ${err.message}`;
  }
}
program.command("audit <file>").description("Audit backend code for security and best practices").action(async (file) => {
  const code = readFileOrExit(file);
  const prompt = `Audit this backend code for security and best practices:

${code}`;
  const systemPrompt = "You are a backend code security and best practices auditor.";
  const result = await callOpenAI(prompt, systemPrompt);
  console.log(result);
});
program.command("explain <file>").description("Explain code, functions, or files").action(async (file) => {
  const code = readFileOrExit(file);
  const prompt = `Explain the following backend code in detail:

${code}`;
  const systemPrompt = "You are a senior backend engineer who explains code clearly.";
  const result = await callOpenAI(prompt, systemPrompt);
  console.log(result);
});
program.command("testgen <file>").description("Generate tests for backend code").action(async (file) => {
  const code = readFileOrExit(file);
  const prompt = `Generate comprehensive tests for this backend code:

${code}`;
  const systemPrompt = "You are a backend test engineer who writes robust, idiomatic tests.";
  const result = await callOpenAI(prompt, systemPrompt);
  console.log(result);
});
program.parseAsync(process.argv);
