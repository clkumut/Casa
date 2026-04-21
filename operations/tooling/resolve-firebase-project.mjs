import { loadEnvironmentFile } from './load-environment-file.mjs';

const ENVIRONMENT_VARIABLES = {
  dev: 'CASA_FIREBASE_PROJECT_DEV',
  staging: 'CASA_FIREBASE_PROJECT_STAGING',
  prod: 'CASA_FIREBASE_PROJECT_PROD',
};

const SUPPORTED_ENVIRONMENTS = ['local', 'dev', 'staging', 'prod'];

const fail = (message) => {
  console.error(`[resolve-firebase-project] ${message}`);
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

const getBoundProject = (environment) => {
  if (environment === 'local') {
    return 'demo-casa-local';
  }

  const variableName = ENVIRONMENT_VARIABLES[environment];
  const variableValue = process.env[variableName]?.trim();

  if (!variableValue) {
    fail(`Missing required environment variable ${variableName} for ${environment}.`);
  }

  return variableValue;
};

const environment = getEnvironment();
loadEnvironmentFile(environment);
const projectId = getBoundProject(environment);

process.stdout.write(`${projectId}\n`);