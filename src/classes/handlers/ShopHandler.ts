import FluorineClient from '@classes/Client';
import r from 'rethinkdb';
import { ShopItem } from 'types/shop';

export default class ShopHandler {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    async list(guild: string): Promise<ShopItem[]> {
        return r
            .table('shop')
            .getAll(guild, { index: 'guild' })
            .coerceTo('array')
            .run(this.client.conn);
    }
    async get(name: string, guild: string): Promise<ShopItem> {
        const all = await r
            .table('shop')
            .getAll([name, guild], { index: 'item' })
            .coerceTo('array')
            .run(this.client.conn);
        return all[0];
    }
    async add(obj: ShopItem) {
        return r.table('shop').insert(obj).run(this.client.conn);
    }
    async delete(name: string, guild: string) {
        const [{ id }] = await r
            .table('shop')
            .getAll([name, guild], { index: 'item' })
            .coerceTo('array')
            .run(this.client.conn);
        return r.table('shop').get(id).delete().run(this.client.conn);
    }
}
