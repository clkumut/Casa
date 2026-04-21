import { onRequest } from 'firebase-functions/v2/https';

import { BuildReadyService } from '../application/build-ready.service';

const buildReadyService = new BuildReadyService();

export const buildReady = onRequest({ cors: true }, (_request, response) => {
  response.set('Cache-Control', 'no-store');
  response.status(200).json(buildReadyService.getResponse());
});