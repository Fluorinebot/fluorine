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
        const ai = await fetch(`${process.env.AI_URL}/${text}?token=${process.env.AI_TOKEN}`)
            .catch(err => {
                this.isGenerating = false;
                return err;
            })
            .then(res => res.json());
        if (!ai.result) {
            return object.reply(
                this.client.i18n.t('AI_ERROR', {
                    lng: object.guild.preferredLocale
                })
            );
        }
        const embed = new Embed(this.client, object.locale ?? object.guild.preferredLocale)
            .setLocaleTitle('AI_TITLE')
            .setDescription(ai.result);
        object instanceof Message ? object.reply({ embeds: [embed] }) : object.followUp({ embeds: [embed] });
        this.queue.shift();
        if (this.queue.length === 0) {
            this.isGenerating = false;
        } else {
            this.generate();
        }
    }
}
