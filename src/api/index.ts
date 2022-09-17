import Fastify, { type FastifyInstance } from 'fastify';
export class Dashboard {
    fastify: FastifyInstance;
    constructor() {
        this.fastify = Fastify();
    }
}
