import FluorineClient from '@classes/Client';
import { Guild, User } from 'discord.js';
import { Case } from 'types/databaseTables';

export default class CasesModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }

    create(guild: Guild, user: User, creator: User, type: 'ban' | 'kick' | 'timeout' | 'warn', reason: string): Case {
        return {
            caseId: 1,
            guildId: BigInt(guild.id),
            caseCreator: BigInt(creator.id),
            moderatedUser: BigInt(user.id),
            type,
            reason
        };
    }

    getOne(guild: Guild, caseId: number) {
        return null;
    }

    getMany(guild: Guild) {
        return null;
    }

    logToModerationChannel(guild: Guild, caseObj: Case) {
        return null;
    }
}
