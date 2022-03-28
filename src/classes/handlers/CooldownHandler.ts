import FluorineClient from '@classes/Client';
import { User } from 'discord.js';
import { Cooldown } from 'types/databaseTables';

export default class CooldownHandler {
    constructor(private client: FluorineClient) {
        this.client = client;
    }

    async get(user: User, command: string) {
        const query = await this.client.db.query<Cooldown>('SELECT * FROM cooldowns WHERE user_id = $1 AND name = $2', [
            BigInt(user.id),
            command
        ]);

        return query.rows[0];
    }

    async has(user: User, command: string) {
        const query = await this.client.db.query<Cooldown>('SELECT * FROM cooldowns WHERE user_id = $1 AND name = $2', [
            BigInt(user.id),
            command
        ]);

        return query.rows.length === 1;
    }

    async delete(user: User, command: string) {
        await this.client.db.query('DELETE FROM cooldowns WHERE user_id = $1 AND name = $2', [
            BigInt(user.id),
            command
        ]);
    }

    async set(user: User, command: string, cooldown?: number) {
        const [query] = (
            await this.client.db.query<Cooldown>(
                'INSERT INTO cooldowns(user_id, name, timestamp) VALUES ($1, $2, $3) RETURNING *;',
                [BigInt(user.id), command, BigInt(Date.now() + (cooldown ?? 2000))]
            )
        ).rows;

        return query;
    }
}
