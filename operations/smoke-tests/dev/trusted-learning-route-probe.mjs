import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..', '..', '..');
const DEFAULT_APP_PORT = 4310;
const appPort = await findAvailablePort(DEFAULT_APP_PORT);
const appBaseUrl = `http://127.0.0.1:${appPort}`;
const RUN_TIMEOUT_MS = 60000;
const targetRoute = process.env.CASA_PROBE_ROUTE ?? '/app/learn';

const EDGE_CANDIDATE_PATHS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

async function findAvailablePort(startingPort, attempts = 20) {
  for (let port = startingPort; port < startingPort + attempts; port += 1) {
    const isAvailable = await new Promise((resolvePort) => {
      const server = createServer();

      server.unref();
      server.once('error', () => {
        resolvePort(false);
      });
      server.listen(port, '127.0.0.1', () => {
        server.close(() => resolvePort(true));
      });
    });

    if (isAvailable) {
      return port;
    }
  }

  throw new Error(`Could not find an available static server port after ${attempts} attempts.`);
}

const waitForHttpOk = async (url, timeoutMs = 10000) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Keep polling until timeout.
    }

    await delay(200);
  }

  throw new Error(`Timed out waiting for ${url}.`);
};

const collectChildOutput = (childProcess) => {
  let stdout = '';
  let stderr = '';

  childProcess.stdout?.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  childProcess.stderr?.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  return {
    getStderr: () => stderr,
    getStdout: () => stdout,
  };
};

const resolveEdgeExecutablePath = () => {
  const overridePath = process.env.PLAYWRIGHT_BROWSER_PATH;

  if (overridePath && existsSync(overridePath)) {
    return overridePath;
  }

  const resolvedPath = EDGE_CANDIDATE_PATHS.find((candidatePath) => existsSync(candidatePath));

  if (!resolvedPath) {
    throw new Error('Microsoft Edge executable was not found for route probe.');
  }

  return resolvedPath;
};

const runSeedScript = async () => {
  const seedProcess = spawn(process.execPath, ['./operations/smoke-tests/dev/trusted-learning-route-sanity-seed.mjs'], {
    cwd: workspaceRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const seedOutput = collectChildOutput(seedProcess);

  const exitCode = await new Promise((resolveExit) => {
    seedProcess.on('exit', resolveExit);
  });

  if (exitCode !== 0) {
    throw new Error(`Route probe seed failed: ${seedOutput.getStderr() || seedOutput.getStdout()}`);
  }

  return JSON.parse(seedOutput.getStdout().trim());
};

const startStaticServer = async () => {
  const serverProcess = spawn(
    process.execPath,
    ['./operations/tooling/serve-static-spa.mjs', './apps/web/dist/casa-web/browser', `${appPort}`],
    {
      cwd: workspaceRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  const serverOutput = collectChildOutput(serverProcess);

  await waitForHttpOk(`${appBaseUrl}/auth/login`);

  return {
    serverOutput,
    serverProcess,
  };
};

const stopChild = async (childProcess) => {
  if (!childProcess || childProcess.killed) {
    return;
  }

  childProcess.kill('SIGINT');

  await Promise.race([
    new Promise((resolveExit) => {
      childProcess.once('exit', resolveExit);
    }),
    delay(5000).then(() => {
      if (!childProcess.killed) {
        childProcess.kill('SIGKILL');
      }
    }),
  ]);
};

let browser = null;
let context = null;
let page = null;
let serverProcess = null;
let serverOutput = null;
let consoleMessages = [];
let navigationEvents = [];
let lifecycleEvents = [];

try {
  await Promise.race([
    (async () => {
      const seed = await runSeedScript();
      ({ serverOutput, serverProcess } = await startStaticServer());

      browser = await chromium.launch({
        executablePath: resolveEdgeExecutablePath(),
        headless: true,
        args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-default-browser-check', '--no-first-run'],
      });

      context = await browser.newContext();
      page = await context.newPage();
      page.on('console', (msg) => {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      });
      page.on('pageerror', (err) => {
        consoleMessages.push(`pageerror: ${err?.message || String(err)}`);
      });
      page.on('crash', () => {
        lifecycleEvents.push('page:crash');
      });
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) {
          navigationEvents.push(frame.url());
        }
      });
      page.on('requestfailed', (req) => {
        const failure = req.failure ? req.failure() : null;
        consoleMessages.push(`requestfailed: ${req.url()} ${failure ? failure.errorText || '' : ''}`);
      });
      page.setDefaultTimeout(15000);

      await page.goto(`${appBaseUrl}/auth/login`, { waitUntil: 'domcontentloaded' });
      await page.locator('input[autocomplete="email"]').fill(seed.email);
      await page.locator('input[autocomplete="current-password"]').fill(seed.password);
      await page.getByRole('button', { name: 'Giris yap' }).click();
      await delay(1500);

      await page.goto(`${appBaseUrl}${targetRoute}`, { waitUntil: 'domcontentloaded' });
      await delay(5000);

      const currentUrl = page.url();
      const title = await Promise.race([
        page.evaluate(() => document.title),
        delay(1000).then(() => 'unavailable'),
      ]).catch(() => 'unavailable');
      const readyState = await Promise.race([
        page.evaluate(() => document.readyState),
        delay(1000).then(() => 'unavailable'),
      ]).catch(() => 'unavailable');
      const bodyText = await Promise.race([
        page.evaluate(() => document.body?.innerText ?? null),
        delay(2000).then(() => 'unavailable'),
      ]).catch(() => 'unavailable');
      const htmlSnippet = await Promise.race([
        page.evaluate(() => document.documentElement.outerHTML.slice(0, 4000)),
        delay(2000).then(() => 'unavailable'),
      ]).catch(() => 'unavailable');

      console.log(
        JSON.stringify(
          {
            smokeId: 'SMK-WP-005-003-PROBE',
            consoleDump: consoleMessages.slice(-100),
            currentUrl,
            lifecycleEvents,
            navigationEvents,
            requestedRoute: targetRoute,
            path: (() => {
              try {
                return new URL(currentUrl).pathname;
              } catch {
                return 'unavailable';
              }
            })(),
            readyState,
            title,
            bodyText: typeof bodyText === 'string' ? bodyText.slice(0, 4000) : bodyText,
            htmlSnippet,
          },
          null,
          2,
        ),
      );
    })(),
    delay(RUN_TIMEOUT_MS).then(() => {
      throw new Error('Route probe exceeded watchdog timeout.');
    }),
  ]);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        smokeId: 'SMK-WP-005-003-PROBE',
      },
      null,
      2,
    ),
  );

  process.exitCode = 1;
} finally {
  await browser?.close();
  await stopChild(serverProcess);

  if (serverOutput?.getStderr()) {
    console.error(serverOutput.getStderr());
  }
}
