import type { FluorineClient } from '#classes';
import type { Prisma } from '@prisma/client';
import type { User } from 'discord.js';

export class CooldownHandler {
    table: Prisma.CooldownDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.table = this.client.prisma.cooldown;
    }

    async get(user: User, command: string) {
        return this.table.findUnique({
            where: {
                userId_name: {
                    userId: BigInt(user.id),
                    name: command
                }
            }
        });
    }

    async has(user: User, command: string) {
        const query = await this.table.findMany({
            where: {
                userId: BigInt(user.id),
                name: command
            }
        });

        return query.length !== 0;
    }

    async delete(user: User, command: string) {
        await this.table.delete({
            where: {
                userId_name: {
                    userId: BigInt(user.id),
                    name: command
                }
            }
        });
    }

    async set(user: User, command: string, cooldown?: number) {
        return this.table.create({
            data: {
                userId: BigInt(user.id),
                name: command,
                timestamp: BigInt(Date.now() + (cooldown ?? 5000))
            }
        });
    }
}
