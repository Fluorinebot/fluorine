import type { FluorineClient } from '#classes';
import type { EconomyProfile, Prisma } from '@prisma/client';
import type { User } from 'discord.js';

export class EconomyModule {
    table: Prisma.EconomyProfileDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.table = this.client.prisma.economyProfile;
    }

    async get(guild: string, user: User): Promise<EconomyProfile | undefined> {
        const query = this.table.upsert({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            update: {},
            create: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: 0,
                bankBal: 0
            }
        });

        return query;
    }

    async add(guild: string, user: User, amount: number) {
        const query = await this.table.upsert({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            update: {
                walletBal: { increment: amount }
            },
            create: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: amount,
                bankBal: 0
            }
        });

        return query;
    }

    async subtract(guild: string, user: User, amount: number) {
        const query = await this.table.upsert({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            update: {
                walletBal: { decrement: amount }
            },
            create: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: 0 - amount,
                bankBal: 0
            }
        });

        return query;
    }

    async deposit(guild: string, user: User, amount: number) {
        const query = await this.table.upsert({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            update: {
                walletBal: { decrement: amount },
                bankBal: { increment: amount }
            },
            create: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: 0 - amount,
                bankBal: 0 + amount
            }
        });

        return query;
    }

    async withdraw(guild: string, user: User, amount: number) {
        const query = await this.table.upsert({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            update: {
                walletBal: { increment: amount },
                bankBal: { decrement: amount }
            },
            create: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: 0 + amount,
                bankBal: 0 - amount
            }
        });

        return query;
    }

    async getCurrency(guild: string) {
        const { currency } = await this.client.prisma.config.findUnique({
            where: { guildId: BigInt(guild) },
            select: { currency: true }
        });

        return currency || '🪙';
    }
    async getAll(guild: string) {
        return this.table.findMany({
            where: { guildId: BigInt(guild) }
        });
    }
}
