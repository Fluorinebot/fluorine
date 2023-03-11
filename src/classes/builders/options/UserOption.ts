import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandUserOption } from 'discord.js';

export class UserOption extends BaseOptionBuilder<SlashCommandUserOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.User, baseKey);
        this.builder = new SlashCommandUserOption();
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
