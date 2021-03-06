import FluorineClient from '#classes/Client';
import { CommandInteraction, ContextMenuCommandInteraction } from 'discord.js';
import Embed from '#classes/Embed';
import { AIQueue } from '#types/structures';

export default class AIModule {
    queue: AIQueue[];
    isGenerating: boolean;

    constructor(private client: FluorineClient) {
        this.client = client;
        this.queue = [];
        this.isGenerating = false;
    }

    async getAI(interaction: CommandInteraction | ContextMenuCommandInteraction, text: string): Promise<void> {
        const base64String = Buffer.from(text || 'h').toString('base64');

        this.queue.push({ interaction, text: base64String });

        if (!this.isGenerating) {
            this.isGenerating = true;
            this.generate();
        }
    }

    async generate(): Promise<void> {
        const [{ interaction, text }] = this.queue;
        const ai = await fetch(`${process.env.AI_URL}/${text}?token=${process.env.AI_TOKEN}`)
            .catch(err => {
                this.isGenerating = false;
                throw err;
            })
            .then(res => res.json() as Record<string, any>);

        if (!ai.result) {
            interaction.reply(
                this.client.i18n.t('AI_ERROR', {
                    lng: interaction.locale
                })
            );

            return;
        }

        const embed = new Embed(this.client, interaction.locale).setLocaleTitle('AI_TITLE').setDescription(ai.result);

        interaction.followUp({ embeds: [embed] });

        this.queue.shift();

        if (this.queue.length === 0) {
            this.isGenerating = false;
        } else {
            this.generate();
        }
    }
}
