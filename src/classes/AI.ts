import FluorineClient from './Client';
import { fetch } from 'undici';
import { Interaction, Message } from 'discord.js';
import Embed from './Embed';

export default class AI {
    client: FluorineClient;
    queue: any[];
    isGenerating: boolean;
    constructor(client: FluorineClient) {
        this.client = client;
        this.queue = [];
        this.isGenerating = false;
    }
    async getAI(message: Message | Interaction, text: string): Promise<any> {
        this.queue.push({ object: message, text });
        if (!this.isGenerating) {
            this.isGenerating = true;
            this.generate();
        }
    }
    async generate(): Promise<any> {
        const [{ object, text }] = this.queue;
        const ai: any = await (
            await fetch(
                `${this.client.config.aiurl}/${text}?token=${this.client.config.aitoken}`
            ).catch(err => {
                this.isGenerating = false;
                return err;
            })
        )
            // @ts-ignore
            .json();
        if (!ai.result) {
            return object.reply(
                this.client.language.get(
                    object.guild.preferredLocale,
                    'AI_ERROR'
                )
            );
        }
        const embed = new Embed(this.client, object.guild.preferredLocale)
            .setLocaleTitle('AI_TITLE')
            .setDescription(ai.result);
        object.reply({ embeds: [embed] });
        this.queue.shift();
        if (this.queue.length === 0) {
            this.isGenerating = false;
        } else {
            this.generate();
        }
    }
}
