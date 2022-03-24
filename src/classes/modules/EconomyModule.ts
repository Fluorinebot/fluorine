import FluorineClient from '@classes/Client';
import r from 'rethinkdb';
import { EconomyUser } from 'types/economyUser';
import { SettingsType } from 'types/settings';

export default class EconomyModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }
    async get(user: string, guild: string) {
        const data = (await r.table('economy').get(`${user}-${guild}`).run(this.client.conn)) as EconomyUser;
        return data?.balance || { wallet: 0, bank: 0 };
    }
    async add(user: string, guild: string, amount: number) {
        const userObj: any = await r.table('economy').get(`${user}-${guild}`).run(this.client.conn);
        if (!userObj) {
            return r
                .table('economy')
                .insert({
                    id: `${user}-${guild}`,
                    balance: { wallet: amount, bank: 0 }
                })
                .run(this.client.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({
                balance: {
                    wallet: userObj.balance.wallet + amount,
                    bank: userObj.balance.bank
                }
            })
            .run(this.client.conn);
    }
    async subtract(user: string, guild: string, amount: number) {
        const userObj: any = await r.table('economy').get(`${user}-${guild}`).run(this.client.conn);
        if (!userObj) {
            return r
                .table('economy')
                .insert({
                    id: `${user}-${guild}`,
                    balance: { wallet: 0 - amount, bank: 0 }
                })
                .run(this.client.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({
                balance: {
                    wallet: userObj.balance.wallet - amount,
                    bank: userObj.balance.bank
                }
            })
            .run(this.client.conn);
    }
    async deposit(user: string, guild: string, amount: number) {
        const userObj: any = await r.table('economy').get(`${user}-${guild}`).run(this.client.conn);
        if (!userObj) {
            return r
                .table('economy')
                .insert({
                    id: `${user}-${guild}`,
                    balance: { wallet: 0, bank: 0 }
                })
                .run(this.client.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({
                balance: {
                    wallet: userObj.balance.wallet - amount,
                    bank: userObj.balance.bank + amount
                }
            })
            .run(this.client.conn);
    }
    async withdraw(user: string, guild: string, amount: number) {
        const userObj: any = await r.table('economy').get(`${user}-${guild}`).run(this.client.conn);
        if (!userObj) {
            return r
                .table('economy')
                .insert({
                    id: `${user}-${guild}`,
                    balance: { wallet: 0, bank: 0 }
                })
                .run(this.client.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({
                balance: {
                    wallet: userObj.balance.wallet + amount,
                    bank: userObj.balance.bank - amount
                }
            })
            .run(this.client.conn);
    }
    async getCooldown(user: string, guild: string) {
        const userObj = (await r.table('economy').get(`${user}-${guild}`).run(this.client.conn)) as EconomyUser;
        return userObj?.cooldown || { work: 0 };
    }
    async setCooldown(user: string, guild: string, cooldown: EconomyUser['cooldown']) {
        const userObj: any = await r.table('economy').get(`${user}-${guild}`).run(this.client.conn);
        if (!userObj) {
            return r
                .table('economy')
                .insert({
                    id: `${user}-${guild}`,
                    balance: { wallet: 0, bank: 0 },
                    cooldown
                })
                .run(this.client.conn);
        }
        return r
            .table('economy')
            .get(`${user}-${guild}`)
            .update({
                cooldown
            })
            .run(this.client.conn);
    }
    async getCurrency(guild: string) {
        const guildObj = (await r.table('config').get(guild).run(this.client.conn)) as SettingsType;
        return guildObj?.currency || '🪙';
    }
}
