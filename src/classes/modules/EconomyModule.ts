import FluorineClient from '@classes/Client';
import { User } from 'discord.js';
import { Config, Economy } from 'types/databaseTables';

export default class EconomyModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }

    private async createProfile(guild: string, user: User, objectOverrides?: Omit<Economy, 'guild_id' | 'user_id'>) {
        const [query] = (
            await this.client.db.query<Economy>(
                'INSERT INTO economy(guild_id, user_id, wallet_bal, bank_bal) VALUES ($1, $2, $3, $4) RETURNING *;',
                [
                    BigInt(guild),
                    BigInt(user.id),
                    BigInt(objectOverrides?.wallet_bal ?? 0),
                    BigInt(objectOverrides?.bank_bal ?? 0)
                ]
            )
        ).rows;

        return query;
    }

    async get(guild: string, user: User) {
        const [query] = (
            await this.client.db.query<Economy>('SELECT * FROM economy WHERE guild_id = $1 AND user_id = $2;', [
                BigInt(guild),
                BigInt(user.id)
            ])
        ).rows;

        if (!query) {
            const profile = await this.createProfile(guild, user);
            return profile;
        }

        return query;
    }

    async add(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { wallet_bal: amount, bank_bal: 0 });
        }

        const [query] = (
            await this.client.db.query<Economy>(
                'UPDATE economy SET wallet_bal = $1 WHERE guild_id = $2 AND user_id = $3 RETURNING *;',
                [userObj.wallet_bal + amount, BigInt(guild), BigInt(user.id)]
            )
        ).rows;

        return query;
    }

    async subtract(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { wallet_bal: 0 - amount, bank_bal: 0 });
        }

        const [query] = (
            await this.client.db.query<Economy>(
                'UPDATE economy SET wallet_bal = $1 WHERE guild_id = $2 AND user_id = $3 RETURNING *;',
                [userObj.wallet_bal - amount, BigInt(guild), BigInt(user.id)]
            )
        ).rows;

        return query;
    }

    async deposit(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { wallet_bal: 0 - amount, bank_bal: 0 + amount });
        }

        const [query] = (
            await this.client.db.query<Economy>(
                'UPDATE economy SET wallet_bal = $1, bank_bal = $2 WHERE guild_id = $3 AND user_id = $4 RETURNING *;',
                [userObj.wallet_bal - amount, userObj.bank_bal + amount, BigInt(guild), BigInt(user.id)]
            )
        ).rows;

        return query;
    }

    async withdraw(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { wallet_bal: 0 + amount, bank_bal: 0 - amount });
        }

        const [query] = (
            await this.client.db.query<Economy>(
                'UPDATE economy SET wallet_bal = $1, bank_bal = $2 WHERE guild_id = $3 AND user_id = $4 RETURNING *;',
                [userObj.wallet_bal + amount, userObj.bank_bal - amount, BigInt(guild), BigInt(user.id)]
            )
        ).rows;

        return query;
    }

    async getCurrency(guild: string) {
        const [settings] = (
            await this.client.db.query<Config>('SELECT currency FROM config WHERE guild_id = $1', [BigInt(guild)])
        ).rows;

        return settings.currency;
    }
}
