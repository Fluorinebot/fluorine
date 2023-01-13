import { BaseOption } from '#builders';
import { ApplicationCommandOptionType, SlashCommandMentionableOption } from 'discord.js';

// https://discord.js.org/#/docs/builders/main/class/SlashCommandMentionableOption
export class MentionableOption extends BaseOption<SlashCommandMentionableOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Mentionable, baseKey);
        this.builder = new SlashCommandMentionableOption();
    }
}
