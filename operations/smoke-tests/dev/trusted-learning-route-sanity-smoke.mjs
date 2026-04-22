import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
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

const EDGE_CANDIDATE_PATHS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const RUN_TIMEOUT_MS = 120000;

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

const logStep = (message) => {
  currentStep = message;
  console.log(`[route-sanity] ${message}`);
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
    throw new Error('Microsoft Edge executable was not found for route sanity smoke.');
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
    throw new Error(`Route sanity seed failed: ${seedOutput.getStderr() || seedOutput.getStdout()}`);
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

const waitForBodyText = async (page, expectedText, timeoutMs = 10000) => {
  const crashPromise = new Promise((_, reject) => {
    page.once('crash', () => {
      reject(new Error(`Page crashed while waiting for text: ${expectedText}`));
    });
  });
  const closePromise = new Promise((_, reject) => {
    page.once('close', () => {
      reject(new Error(`Page closed while waiting for text: ${expectedText}`));
    });
  });

  await Promise.race([
    page.waitForFunction(
      (needle) => document.body.innerText.includes(needle),
      expectedText,
      { timeout: timeoutMs },
    ),
    crashPromise,
    closePromise,
    delay(timeoutMs + 1000).then(() => {
      throw new Error(`Timed out waiting for text: ${expectedText}`);
    }),
  ]);
};

let browser = null;
let context = null;
let page = null;
let serverProcess = null;
let serverOutput = null;
let consoleMessages = [];
let currentStep = 'initializing';
const artifactsDir = resolve(__dirname, 'artifacts');
mkdirSync(artifactsDir, { recursive: true });

try {
  await Promise.race([
    (async () => {
  logStep('seeding emulator data');
  const seed = await runSeedScript();
  logStep(`seed ready for ${seed.email}`);
  ({ serverOutput, serverProcess } = await startStaticServer());
  logStep(`static server ready at ${appBaseUrl}`);

  browser = await chromium.launch({
    executablePath: resolveEdgeExecutablePath(),
    headless: true,
    args: ['--disable-dev-shm-usage', '--disable-gpu', '--no-default-browser-check', '--no-first-run'],
  });
  logStep('headless browser launched');

  context = await browser.newContext();
  // start Playwright tracing to capture snapshots and screenshots
  try {
    // tracing API may not be available in older playwright-core builds; guard it
    if (context?.tracing?.start) {
      await context.tracing.start({ screenshots: true, snapshots: true });
    }
  } catch (e) {
    // non-fatal; continue
    console.warn('Tracing start failed:', e?.message || e);
  }

  page = await context.newPage();
  // Inject init-time error handlers so we capture errors during app bootstrap
  try {
    await context.addInitScript({
      content: `
        (function () {
          try {
            window.__smoke_errors = [];
            window.addEventListener('error', function (e) {
              try { window.__smoke_errors.push('error:' + (e && e.message ? e.message : String(e))); } catch (e) {}
              console.error('SMOKE_WINDOW_ERROR', e && e.message ? e.message : e);
            });
            window.addEventListener('unhandledrejection', function (e) {
              try { window.__smoke_errors.push('unhandled:' + (e && e.reason && e.reason.message ? e.reason.message : String(e.reason))); } catch (e) {}
              console.error('SMOKE_UNHANDLED_REJECTION', e && e.reason ? (e.reason.message || String(e.reason)) : String(e));
            });
          } catch (e) { console.error('SMOKE_INIT_INJECTION_FAILED', e && e.message ? e.message : String(e)); }
        })();
      `,
    });
  } catch (e) {
    // non-fatal
    console.warn('addInitScript failed:', e?.message || e);
  }
  page.on('console', (msg) => {
    try {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    } catch {
      // ignore
    }
  });
  page.on('pageerror', (err) => {
    try {
      consoleMessages.push(`pageerror: ${err?.message || String(err)}`);
    } catch {}
  });
  page.on('requestfailed', (req) => {
    try {
      const f = req.failure ? req.failure() : null;
      consoleMessages.push(`requestfailed: ${req.url()} ${f ? f.errorText || f.error || '' : ''}`);
    } catch {}
  });
  page.setDefaultTimeout(20000);

  await page.goto(`${appBaseUrl}/auth/login`, { waitUntil: 'domcontentloaded' });
  logStep('login page opened');
  await page.locator('input[autocomplete="email"]').fill(seed.email);
  await page.locator('input[autocomplete="current-password"]').fill(seed.password);
  await page.getByRole('button', { name: 'Giris yap' }).click();
  logStep('login submitted');
  await waitForBodyText(page, 'Authenticated');
  logStep('authenticated session confirmed');

  // Navigate to the learn route directly to ensure Angular bootstraps with that URL
  await page.goto(`${appBaseUrl}/app/learn`, { waitUntil: 'domcontentloaded' });
  logStep('learn home route opened (navigated)');
  await waitForBodyText(page, 'Ogrenme haritasi bootstrap gorunumu', 30000);
  await waitForBodyText(page, 'Unit detail');
  logStep('learn home content confirmed');

  await page.locator(`a[href="${seed.unitRoute}"]`).click();
  logStep(`unit route opened: ${seed.unitRoute}`);
  await waitForBodyText(page, 'Published lesson kesiti');
  await waitForBodyText(page, 'Route Sanity Unit');
  logStep('unit route content confirmed');

  const unitSummary = await page.evaluate(() => ({
    bodyText: document.body.innerText,
    href: location.pathname,
  }));

  await page.locator(`a[href="${seed.lessonRoute}"]`).first().click();
  logStep(`lesson route opened: ${seed.lessonRoute}`);
  await waitForBodyText(page, 'Lesson execution boundary');
  await waitForBodyText(page, 'Route Sanity Lesson 1');
  await waitForBodyText(page, 'Ilk challengei baslat');
  await waitForBodyText(page, 'Lesson tamamla');
  logStep('lesson route content confirmed');

  const lessonSummary = await page.evaluate(() => ({
    bodyText: document.body.innerText,
    href: location.pathname,
  }));

  console.log(
    JSON.stringify(
      {
        smokeId: 'SMK-WP-005-003',
        authEmail: seed.email,
        lessonRoute: lessonSummary.href,
        lessonTitle: lessonSummary.bodyText.includes('Route Sanity Lesson 1')
          ? 'Route Sanity Lesson 1'
          : null,
        unitRoute: unitSummary.href,
        unitTitle: unitSummary.bodyText.includes('Route Sanity Unit')
          ? 'Route Sanity Unit'
          : null,
      },
      null,
      2,
    ),
  );
  // capture success artifacts
  try {
    const screenshotPath = resolve(artifactsDir, `screenshot-success-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    try {
      if (context?.tracing?.stop) {
        const tracePath = resolve(artifactsDir, `trace-success-${Date.now()}.zip`);
        await context.tracing.stop({ path: tracePath });
        console.log(JSON.stringify({ artifact: { screenshot: screenshotPath, trace: tracePath } }));
      }
    } catch (e) {
      console.warn('Tracing stop failed:', e?.message || e);
    }
  } catch (e) {
    console.warn('Could not write success screenshot/trace:', e?.message || e);
  }
    })(),
    delay(RUN_TIMEOUT_MS).then(() => {
      throw new Error(`Smoke watchdog exceeded while waiting at step: ${currentStep}`);
    }),
  ]);
} catch (error) {
  const failureContext = page && !page.isClosed()
    ? {
        title: await Promise.race([
          page.title(),
          delay(1000).then(() => 'unavailable'),
        ]).catch(() => 'unavailable'),
        url: page.url(),
        bodyText: await page.evaluate(() => document.body ? document.body.innerText : null).catch(() => null),
        consoleDump: consoleMessages.slice(-200).join('\n'),
      }
    : null;
  // attempt to capture screenshot and trace on failure
  try {
    if (page && !page.isClosed()) {
      const failureScreenshot = resolve(artifactsDir, `screenshot-failure-${Date.now()}.png`);
      await page.screenshot({ path: failureScreenshot, fullPage: true }).catch(() => {});
      // try to stop tracing
      try {
        if (context?.tracing?.stop) {
          const failureTrace = resolve(artifactsDir, `trace-failure-${Date.now()}.zip`);
          await context.tracing.stop({ path: failureTrace }).catch(() => {});
          // attach artifact paths to failureContext
          failureContext.artifacts = { screenshot: failureScreenshot, trace: failureTrace };
        } else {
          failureContext.artifacts = { screenshot: failureScreenshot };
        }
      } catch (e) {
        // ignore tracing stop errors
      }
    }
  } catch (e) {
    // ignore artifact capture errors
  }

  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error),
        failureContext,
        smokeId: 'SMK-WP-005-003',
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
