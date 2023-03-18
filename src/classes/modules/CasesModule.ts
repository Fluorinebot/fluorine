import { EmbedBuilder } from '#builders';
import type { FluorineClient } from '#classes';
import type { Prisma } from '@prisma/client';
import type { User } from 'discord.js';

export class CasesModule {
    table: Prisma.CaseDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.table = this.client.prisma.case;
    }

    async create(guildId: string, moderatedUser: User, caseCreator: User, type: string, reason: string) {
        const [fetchedId] = await this.table.findMany({
            where: { guildId: BigInt(guildId) },
            orderBy: { caseId: 'desc' },
            take: 1
        });

        const caseId = fetchedId?.caseId ?? 0;

        const query = await this.table.create({
            data: {
                caseId: caseId + 1,
                guildId: BigInt(guildId),
                caseCreator: BigInt(caseCreator.id),
                moderatedUser: BigInt(moderatedUser.id),
                type,
                reason,
                createdAt: BigInt(Date.now())
            }
        });

        return query;
    }

    async getOne(guild: string, caseId: number) {
        return this.table.findUnique({
            where: {
                caseId_guildId: {
                    caseId,
                    guildId: BigInt(guild)
                }
            }
        });
    }

    async getMany(guild: string, user: User) {
        return this.table.findMany({
            where: {
                guildId: BigInt(guild),
                moderatedUser: BigInt(user.id)
            }
        });
    }

    async logToModerationChannel(guild: string, caseObj: Prisma.CaseCreateInput) {
        const { logModerationActions, logsChannel } = await this.client.prisma.config.findUnique({
            where: {
                guildId: BigInt(guild)
            }
        });

        if (logModerationActions && logsChannel) {
            const creator = await this.client.users.fetch(caseObj.caseCreator.toString());
            const guildObj = this.client.guilds.cache.get(guild);
            const member = await guildObj.members.fetch(caseObj.moderatedUser.toString());

            const embed = new EmbedBuilder(this.client, guildObj.preferredLocale)
                .setTitle('CASE_NEW')
                .setThumbnail(member.displayAvatarURL())
                .addFields([
                    {
                        name: 'CASE_TYPE',
                        value: caseObj.type.toUpperCase() as 'BAN' | 'KICK' | 'WARN' | 'TIMEOUT'
                    },
                    { name: 'CASE_MODERATOR', rawValue: creator.tag },
                    { name: 'CASE_USER', rawValue: member.user.tag },
                    { name: 'REASON', rawValue: caseObj.reason },
                    { name: 'ID', rawValue: `#${caseObj.caseId}` }
                ]);

            const channel = guildObj.channels.cache.get(logsChannel.toString());

            if (!channel?.isTextBased()) {
                return;
            }

            channel.send({ embeds: [embed] });
        }
    }

    async getGuild(id: string) {
        return this.client.prisma.case.findMany({
            where: {
                guildId: BigInt(id)
            }
        });
    }

    async editReason(guildId: string, caseId: number, reason: string) {
        return this.table.update({
            where: {
                caseId_guildId: {
                    caseId,
                    guildId: BigInt(guildId)
                }
            },
            data: {
                reason
            }
        });
    }

    async delete(guildId: string, caseId: number) {
        const caseData = await this.getOne(guildId, caseId);
        const guild = this.client.guilds.cache.get(guildId);
        const user = await this.client.users.fetch(caseData.moderatedUser.toString());

        switch (caseData.type) {
            case 'ban':
                await guild.bans.remove(user);
                break;
            }
            case 'timeout': {
                const member = await guild.members.fetch(user);
                await member.timeout(null);
                break;
            }
        }

        return this.table.delete({
            where: {
                caseId_guildId: {
                    caseId,
                    guildId: bigint(guildId)
                }
            }
        });
    }
}
