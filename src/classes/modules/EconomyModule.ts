import FluorineClient from '@classes/Client';
import { EconomyProfile, Prisma } from '@prisma/client';
import { User } from 'discord.js';

export default class EconomyModule {
    table: Prisma.EconomyProfileDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.table = this.client.prisma.economyProfile;
    }

    private async createProfile(guild: string, user: User, objectOverrides?: { walletBal?: number; bankBal?: number }) {
        const query = this.table.create({
            data: {
                guildId: BigInt(guild),
                userId: BigInt(user.id),
                walletBal: objectOverrides?.walletBal ?? 0,
                bankBal: objectOverrides?.bankBal ?? 0
            }
        });

        return query;
    }

    async get(guild: string, user: User): Promise<EconomyProfile | undefined> {
        const query = this.table.findUnique({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            }
        });

        return query;
    }

    async add(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { walletBal: amount });
        }

        const query = await this.table.update({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            data: { walletBal: userObj.walletBal + amount }
        });

        return query;
    }

    async subtract(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { walletBal: 0 - amount });
        }

        const query = await this.table.update({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            data: { walletBal: userObj.walletBal - amount }
        });

        return query;
    }

    async deposit(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { walletBal: 0 - amount, bankBal: 0 + amount });
        }

        const query = await this.table.update({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            data: {
                walletBal: userObj.walletBal - amount,
                bankBal: userObj.bankBal + amount
            }
        });

        return query;
    }

    async withdraw(guild: string, user: User, amount: number) {
        const userObj = await this.get(guild, user);
        if (!userObj) {
            return this.createProfile(guild, user, { walletBal: 0 + amount, bankBal: 0 - amount });
        }

        const query = await this.table.update({
            where: {
                guildId_userId: {
                    guildId: BigInt(guild),
                    userId: BigInt(user.id)
                }
            },
            data: {
                walletBal: userObj.walletBal + amount,
                bankBal: userObj.bankBal - amount
            }
        });

        return query;
    }

    async getCurrency(guild: string) {
        const { currency } = await this.client.prisma.config.findUnique({
            where: { guildId: BigInt(guild) },
            select: { currency: true }
        });

        return currency;
    }
}
