import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_ENVIRONMENTS = ['local', 'dev', 'staging', 'prod'];
const TOOLING_ROOT = path.dirname(fileURLToPath(import.meta.url));
const ENVIRONMENTS_ROOT = path.resolve(TOOLING_ROOT, '..', 'environments');

const fail = (message) => {
  console.error(`[load-environment-file] ${message}`);
  process.exit(1);
};

const isQuoted = (value, quote) => value.startsWith(quote) && value.endsWith(quote) && value.length >= 2;

const parseValue = (value) => {
  if (isQuoted(value, '"') || isQuoted(value, "'")) {
    return value.slice(1, -1);
  }

  return value;
};

const parseLine = (line) => {
  const separatorIndex = line.indexOf('=');

  if (separatorIndex === -1) {
    return null;
  }

  const key = line.slice(0, separatorIndex).trim();

  if (!key) {
    return null;
  }

  const value = line.slice(separatorIndex + 1).trim();
  return { key, value: parseValue(value) };
};

export const loadEnvironmentFile = (environment) => {
  if (!SUPPORTED_ENVIRONMENTS.includes(environment)) {
    throw new Error(
      `Unsupported environment "${environment}". Use one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}.`,
    );
  }

  if (environment === 'local') {
    return;
  }

  const environmentFilePath = path.join(ENVIRONMENTS_ROOT, environment, '.env');

  if (!existsSync(environmentFilePath)) {
    return;
  }

  const fileContent = readFileSync(environmentFilePath, 'utf8');

  for (const rawLine of fileContent.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const parsedEntry = parseLine(line);

    if (!parsedEntry || process.env[parsedEntry.key] !== undefined) {
      continue;
    }

    process.env[parsedEntry.key] = parsedEntry.value;
  }
};

const environment = process.argv[2]?.toLowerCase();
const currentFilePath = fileURLToPath(import.meta.url);
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === currentFilePath;

if (isDirectExecution) {
  if (!environment) {
    fail(`Missing environment argument. Use one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}.`);
  }

  if (!SUPPORTED_ENVIRONMENTS.includes(environment)) {
    fail(`Unsupported environment "${environment}". Use one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}.`);
  }

  loadEnvironmentFile(environment);
}