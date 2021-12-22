import FluorineClient from '@classes/Client';
import { CategoryChannel } from 'discord.js';

export default class BotConnection {
    client: FluorineClient;
    constructor(bot: FluorineClient) {
        this.client = bot;
    }
    async checkPerms(guild: string, user: string) {
        const guildobj = this.client.guilds.cache.get(guild);
        if (!guildobj) return null;
        const member =
            guildobj.members.cache.get(user) ||
            (await guildobj.members.fetch(user));
        return member.permissions.has('MANAGE_GUILD');
    }
    getChannels(guildID: string) {
        const guild = this.client.guilds.cache.get(guildID);
        if (!guild) return null;
        const categories = guild.channels.cache.filter(
            val => val.type === 'GUILD_CATEGORY'
        );
        const array = [];
        categories.forEach((category: CategoryChannel) => {
            const channels = [];
            category.children
                .sort((a, b) => a.position - b.position)
                .forEach(channel => {
                    if (channel.type === 'GUILD_TEXT') {
                        channels.push({
                            name: channel.name,
                            id: channel.id,
                            type: channel.type,
                            position: channel.rawPosition
                        });
                    }
                });
            array.push({
                name: category.name,
                channels
            });
        });
        array.sort(
            (a: CategoryChannel, b: CategoryChannel) => a.position - b.position
        );
        return array;
    }
    getGuild(guildID: string) {
        const guild = this.client.guilds.cache.get(guildID);
        if (!guild) return null;
        return { name: guild.name, icon: guild.iconURL() };
    }
    getUser(userID: string) {
        return (
            this.client.users.cache.get(userID) ||
            this.client.users.fetch(userID) ||
            null
        );
    }
    sanitizeGuild(data: any) {
        const obj: any = {};
        if (data.modLog) obj.modLog = data.modLog;
        if (data.logChannel) obj.logChannel = data.logChannel;
        if (data.prefix) obj.prefix = data.prefix;
        if (data.muteRole) obj.muteRole = data.muteRole;
        if (data.logs) obj.logs = data.logs;
    }
}
