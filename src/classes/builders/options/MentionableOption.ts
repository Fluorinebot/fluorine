import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandMentionableOption } from 'discord.js';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandMentionableOption
export class MentionableOption extends BaseOptionBuilder<SlashCommandMentionableOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Mentionable, baseKey);
        this.builder = new SlashCommandMentionableOption();
    }
}
