import FluorineClient from '@classes/Client';
import Embed from '@classes/Embed';
import { User } from 'discord.js';
import { Case, Config } from 'types/databaseTables';

export default class CasesModule {
    constructor(private client: FluorineClient) {
        this.client = client;
    }

    async create(guild: string, user: User, creator: User, type: 'ban' | 'kick' | 'timeout' | 'warn', reason: string) {
        const [fetchedId] = (
            await this.client.db.query<Case>(
                'SELECT case_id FROM cases WHERE guild_id = $1 ORDER BY case_id DESC LIMIT 1',
                [BigInt(guild)]
            )
        ).rows;

        const previousId = fetchedId?.case_id ?? 0;

        const [query] = (
            await this.client.db.query<Case>(
                'INSERT INTO cases(case_id, guild_id, case_creator, moderated_user, type, reason) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
                [previousId + 1, BigInt(guild), BigInt(creator.id), BigInt(user.id), type, reason]
            )
        ).rows;

        query.guild_id = BigInt(query.guild_id);
        query.case_creator = BigInt(query.case_creator);
        query.moderated_user = BigInt(query.moderated_user);

        return query;
    }

    async getOne(guild: string, caseId: number) {
        const [ret] = (
            await this.client.db.query<Case>('SELECT * FROM public.cases WHERE guild_id = $1 AND case_id = $2;', [
                BigInt(guild),
                caseId
            ])
        ).rows;

        if (!ret) {
            return null;
        }

        ret.guild_id = BigInt(ret.guild_id);
        ret.case_creator = BigInt(ret.case_creator);
        ret.moderated_user = BigInt(ret.moderated_user);

        return ret;
    }

    async getMany(guild: string, user?: User) {
        let query: string;
        let params: bigint[];

        if (user) {
            query = 'SELECT * FROM public.cases WHERE guild_id = $1 AND moderated_user = $2 ORDER BY case_id ASC;';
            params = [BigInt(guild), BigInt(user.id)];
        } else {
            query = 'SELECT * FROM public.cases WHERE guild_id = $1 ORDER BY case_id ASC;';
            params = [BigInt(guild)];
        }

        const ret = await this.client.db.query<Case>(query, params);
        return ret.rows;
    }

    async logToModerationChannel(guild: string, caseObj: Case) {
        const [settings] = (
            await this.client.db.query<Config>(
                'SELECT log_moderation_actions, logs_channel FROM public.config WHERE guild_id = $1;',
                [BigInt(guild)]
            )
        ).rows;

        if (settings.log_moderation_actions && settings.logs_channel) {
            const creator = await this.client.users.fetch(caseObj.case_creator.toString());
            const guildObj = this.client.guilds.cache.get(guild);
            const member = await guildObj.members.fetch(caseObj.moderated_user.toString());

            const embed = new Embed(this.client, guildObj.preferredLocale)
                .setLocaleTitle('CASE_NEW')
                .setThumbnail(member.displayAvatarURL())
                .addLocaleField({
                    name: 'CASE_TYPE',
                    localeValue: caseObj.type.toUpperCase() as 'BAN' | 'KICK' | 'WARN' | 'MUTE' | 'TIMEOUT'
                })
                .addLocaleField({ name: 'CASE_MODERATOR', value: creator.tag })
                .addLocaleField({ name: 'CASE_USER', value: member.user.tag })
                .addLocaleField({ name: 'REASON', value: caseObj.reason })
                .addField('ID', `#${caseObj.case_id}`);

            const channel = guildObj.channels.cache.get(settings.logs_channel.toString());

            if (!channel?.isText()) {
                return;
            }

            channel.send({ embeds: [embed] });
        }
    }
}
