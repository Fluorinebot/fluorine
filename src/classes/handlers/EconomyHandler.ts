import FluorineClient from '@classes/Client';
import r from 'rethinkdb';
export default class EconomyHandler {
    client: any;
    conn: any;
    constructor(client: FluorineClient) {
        this.client = client;
        this.conn = this.client.conn;
    }
    async add(user: string, guild: string, amount: number) {
        const userData: any = await r.table('economy').get(user).run(this.conn);
        if (!userData) {
            return r
                .table('economy')
                .insert({ id: `${user}-${guild}`, amount })
                .run(this.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({ amount: userData.amount + amount })
            .run(this.conn);
    }
    async subtract(user: string, guild: string, amount: number) {
        const userData: any = await r.table('economy').get(user).run(this.conn);
        if (!userData) {
            return r
                .table('economy')
                .insert({ id: `${user}-${guild}`, amount: 0 - amount })
                .run(this.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({ amount: userData.amount - amount })
            .run(this.conn);
    }
    async get(user: string, guild: string) {
        const userData: any = await r.table('economy').get(user).run(this.conn);
        return userData ?? { id: `${user}-${guild}`, amount: 0 };
    }
}
