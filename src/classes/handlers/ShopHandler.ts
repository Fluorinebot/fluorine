import FluorineClient from '@classes/Client';
import r from 'rethinkdb';

export default class ShopHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    async list(guild: string) {
        return r
            .table('shop')
            .getAll(guild, { index: 'guild' })
            .coerceTo('array')
            .run(this.client.conn);
    }
    async get(guild: string, name: string) {
        const all = r
            .table('shop')
            .getAll([guild, name], { index: 'item' })
            .coerceTo('array')
            .run(this.client.conn);
        return all[0];
    }
}
