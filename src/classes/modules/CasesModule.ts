import FluorineClient from '@classes/Client';
import { Guild, User } from 'discord.js';

export default class CasesModule {
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
    }

    create(guild: Guild, user: User, creator: User, type: 'ban' | 'kick' | 'timeout' | 'warn', reason: string) {
        return {
            id: null,
            guild: guild.id,
            user: user.id,
            creator: creator.id,
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
}
