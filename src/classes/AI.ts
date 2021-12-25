import { TextChannel } from 'discord.js';
import { fetch } from 'undici';
import FluorineClient from './Client';
import Embed from './Embed';
export default class AI {
    queue: any[];
    url: any;
    token: string;
    client: FluorineClient;
    constructor(client: FluorineClient) {
        this.client = client;
        this.url = client.config.aiurls;
        this.token = client.config.aitoken;
        this.queue = [];
    }
    add(user: string, message: string, channel: string, text: string) {
        this.queue.push({ user, message, channel, text });
    }
    async get() {
        const item = this.queue.shift();
        let req = await fetch(
            `${this.url[0]}/?token=${this.token}&topic=${item.text}`
        );
        let res: any = await req.json().catch(() => {
            // h
        });
        if (!res?.text) {
            console.log('lo');
            req = await fetch(
                `${this.url[1]}/?token=${this.token}&topic=${item.text}`
            );
            res = await req.json().catch(() => {
                // h
            });
        }
        const message = (
            this.client.channels.cache.get(item.channel) as TextChannel
        ).messages.cache.get(item.message);
        const embed = new Embed(this.client, message.guild.preferredLocale)
            .setLocaleTitle('AI_TITLE')
            .setLocaleDescription('AI_DESCRIPTION', { text: res.text });
        message.reply({ embeds: [embed] });
    }
}
