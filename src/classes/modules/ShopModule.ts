import FluorineClient from '@classes/Client';
import { Prisma } from '@prisma/client';
import { ShopItemConstructor } from 'types/structures';

export default class ShopModule {
    table: Prisma.ShopItemDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.table = this.client.prisma.shopItem;
    }

    async list(guild: string) {
        const query = this.table.findMany({
            where: { guildId: BigInt(guild) },
            orderBy: { itemId: 'asc' }
        });

        return query;
    }

    async get(guild: string, item: string) {
        const query = await this.table.findFirst({
            where: { guildId: BigInt(guild), name: item }
        });

        return query;
    }

    async add(obj: ShopItemConstructor) {
        const [fetchedId] = await this.table.findMany({
            where: { guildId: BigInt(obj.guildId) },
            orderBy: { itemId: 'desc' },
            take: 1
        });

        const previousId = fetchedId?.itemId ?? 0;

        const query = await this.table.create({
            data: {
                ...obj,
                itemId: previousId + 1
            }
        });

        return query;
    }

    async delete(guild: string, name: string) {
        await this.client.db.query('DELETE FROM shop_items WHERE guild_id = $1 AND name = $2', [BigInt(guild), name]);
    }
}
