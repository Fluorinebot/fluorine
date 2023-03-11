import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandMentionableOption } from 'discord.js';

export class MentionableOption extends BaseOptionBuilder<SlashCommandMentionableOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Mentionable, baseKey);
        this.builder = new SlashCommandMentionableOption();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
