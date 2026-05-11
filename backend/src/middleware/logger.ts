import pinoHttp from 'pino-http';
import pino from 'pino';
import { env } from '../config/env';

const logger = pino({ level: env.logLevel });

export const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  customLogLevel: (res, _err) => {
    if (!res.statusCode) return 'info';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

export { logger };
