import { loadEnvironmentFile } from './load-environment-file.mjs';

const REQUIRED_VARIABLES = {
  dev: [
    'CASA_FIREBASE_PROJECT_DEV',
    'CASA_FIREBASE_WEB_APP_ID_DEV',
    'CASA_FIREBASE_AUTH_DOMAIN_DEV',
    'CASA_FIREBASE_STORAGE_BUCKET_DEV',
    'CASA_FIREBASE_MESSAGING_SENDER_ID_DEV',
    'CASA_FIREBASE_API_KEY_DEV',
  ],
  staging: [
    'CASA_FIREBASE_PROJECT_STAGING',
    'CASA_FIREBASE_WEB_APP_ID_STAGING',
    'CASA_FIREBASE_AUTH_DOMAIN_STAGING',
    'CASA_FIREBASE_STORAGE_BUCKET_STAGING',
    'CASA_FIREBASE_MESSAGING_SENDER_ID_STAGING',
    'CASA_FIREBASE_API_KEY_STAGING',
  ],
  prod: [
    'CASA_FIREBASE_PROJECT_PROD',
    'CASA_FIREBASE_WEB_APP_ID_PROD',
    'CASA_FIREBASE_AUTH_DOMAIN_PROD',
    'CASA_FIREBASE_STORAGE_BUCKET_PROD',
    'CASA_FIREBASE_MESSAGING_SENDER_ID_PROD',
    'CASA_FIREBASE_API_KEY_PROD',
  ],
};

const SUPPORTED_ENVIRONMENTS = ['local', 'dev', 'staging', 'prod'];

const fail = (message) => {
  console.error(`[validate-environment-binding] ${message}`);
  process.exit(1);
};

const getEnvironment = () => {
  const environment = process.argv[2]?.toLowerCase();

  if (!environment) {
    fail(`Missing environment argument. Use one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}.`);
  }

  if (!SUPPORTED_ENVIRONMENTS.includes(environment)) {
    fail(`Unsupported environment \"${environment}\". Use one of: ${SUPPORTED_ENVIRONMENTS.join(', ')}.`);
  }

  return environment;
};

const getMissingVariables = (environment) => {
  const variableNames = REQUIRED_VARIABLES[environment] ?? [];

  return variableNames.filter((variableName) => !process.env[variableName]?.trim());
};

const environment = getEnvironment();
loadEnvironmentFile(environment);

if (environment === 'local') {
  console.log('[validate-environment-binding] local uses the emulator sentinel project demo-casa-local.');
  console.log('[validate-environment-binding] No remote Firebase project binding is required for local.');
  process.exit(0);
}

const missingVariables = getMissingVariables(environment);

if (missingVariables.length > 0) {
  console.error(`[validate-environment-binding] ${environment} is missing required variables:`);

  for (const variableName of missingVariables) {
    console.error(`- ${variableName}`);
  }

  process.exit(1);
}

console.log(`[validate-environment-binding] ${environment} environment binding is complete.`);
console.log(`[validate-environment-binding] ${REQUIRED_VARIABLES[environment].length} variables are present.`);