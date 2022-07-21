import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { Prisma } from '@prisma/client';
import { User } from 'discord.js';

export default class CasesModule {
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
                reason
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

            const embed = new Embed(this.client, guildObj.preferredLocale)
                .setLocaleTitle('CASE_NEW')
                .setThumbnail(member.displayAvatarURL())
                .addLocaleFields([
                    {
                        name: 'CASE_TYPE',
                        localeValue: caseObj.type.toUpperCase() as 'BAN' | 'KICK' | 'WARN' | 'MUTE' | 'TIMEOUT'
                    },
                    { name: 'CASE_MODERATOR', value: creator.tag },
                    { name: 'CASE_USER', value: member.user.tag },
                    { name: 'REASON', value: caseObj.reason },
                    { name: 'ID', value: `#${caseObj.caseId}` }
                ]);

            const channel = guildObj.channels.cache.get(logsChannel.toString());

            if (!channel?.isTextBased()) {
                return;
            }

            channel.send({ embeds: [embed] });
        }
    }
}
