import Knex from 'knex';
import knexConfig from '../knexfile';
import { env } from './env';

const config = knexConfig[env.nodeEnv] ?? knexConfig['development'];
export const db = Knex(config);
