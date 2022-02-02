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
        const ai = await fetch(
            `${process.env.AI_URL}/${text}?token=${process.env.AI_TOKEN}`
        )
            .catch(err => {
                this.isGenerating = false;
                return err;
            })
            .then(res => res.json());
        if (!ai.result) {
            if (object instanceof Message) {
                return object.reply(
                    this.client.language.get(
                        object.guild.preferredLocale,
                        'AI_ERROR'
                    )
                );
            }
            object.followup(
                this.client.language.get(object.locale, 'AI_ERROR')
            );
        }
        const embed = new Embed(
            this.client,
            object.locale || object.guild.preferredLocale
        )
            .setLocaleTitle('AI_TITLE')
            .setDescription(ai.result);
        if (object instanceof Message) {
            object.reply({ embeds: [embed] });
        } else {
            object.followUp({ embeds: [embed] });
        }
        this.queue.shift();
        if (this.queue.length === 0) {
            this.isGenerating = false;
        } else {
            this.generate();
        }
    }
}
