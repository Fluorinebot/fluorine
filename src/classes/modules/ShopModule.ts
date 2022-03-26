import FluorineClient from '@classes/Client';
import { Guild } from 'discord.js';
import { ShopItem } from 'types/databaseTables';

export default class ShopModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }

    async list(guild: Guild): Promise<ShopItem[]> {
        const query = await this.client.db.query<ShopItem>(
            'SELECT * FROM shop_items WHERE guild_id = $1 ORDER BY item_id',
            [BigInt(guild.id)]
        );

        return query.rows;
    }

    async get(guild: Guild, item: string): Promise<ShopItem> {
        const all = await this.client.db.query<ShopItem>('SELECT * FROM shop_items WHERE guild_id = $1 AND name = $2', [
            BigInt(guild.id),
            item
        ]);

        return all.rows[0];
    }

    async add(obj: Omit<ShopItem, 'item_id'>) {
        const [fetchedId] = (
            await this.client.db.query<ShopItem>(
                'SELECT case_id FROM cases WHERE guild_id = $1 ORDER BY case_id DESC LIMIT 1',
                [BigInt(obj.guild_id)]
            )
        ).rows;

        const previousId = fetchedId?.item_id ?? 0;
        const query = await this.client.db.query<ShopItem>(
            'INSERT INTO shop_items(item_id, guild_id, name, description, price, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
            [previousId + 1, BigInt(obj.guild_id), obj.name, obj.description, obj.price, obj.role]
        );

        return query.rows[0];
    }

    async delete(guild: Guild, name: string) {
        await this.client.db.query('DELETE FROM shop_items WHERE guild_id = $1 AND name = $2', [
            BigInt(guild.id),
            name
        ]);
    }
}
