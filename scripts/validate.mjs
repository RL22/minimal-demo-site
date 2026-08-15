#!/usr/bin/env node
import path from "node:path";

import { validateRepository } from "./lib/validator.mjs";

function argumentsFrom(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--route") options.expectedRoute = argv[++index];
    else if (argv[index] === "--changed-file") (options.changedFiles ??= []).push(argv[++index]);
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return options;
}

try {
  const result = await validateRepository(path.resolve("."), argumentsFrom(process.argv.slice(2)));
  for (const error of result.errors) {
    console.error(`${error.path}:${error.line} [${error.code}] ${error.message}`);
  }
  console.log(`${result.summary.routes} routes, ${result.summary.pages} pages, ${result.summary.errors} errors`);
  process.exitCode = result.errors.length === 0 ? 0 : 1;
} catch (error) {
  console.error(`[validator.failure] ${error.message}`);
  process.exitCode = 2;
}
