import type { FluorineClient } from '#classes';
import type { ShopItemConstructor } from '#types';
import type { Prisma } from '@prisma/client';

export class ShopModule {
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

    async get(guild: string, name: string) {
        const item = await this.table.findFirst({
            where: { guildId: BigInt(guild), name }
        });

        return item;
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
        await this.table.deleteMany({
            where: {
                guildId: BigInt(guild),
                name
            }
        });
    }
}
