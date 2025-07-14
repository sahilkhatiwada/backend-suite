import { createLogger } from '@backend-suite/logger';

const logger = createLogger('example', { level: 'info' });
logger.info('Logger example started');
logger.error('This is an error log'); 