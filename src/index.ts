import 'dotenv/config';
import FluorineClient from '@classes/Client';
import { performance } from 'perf_hooks';

export const indexPrepTime = performance.now();
const client = new FluorineClient();
client.init();
