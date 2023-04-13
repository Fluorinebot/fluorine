import { BaseOptionBuilder } from '#builderBases';
import {
    type ApplicationCommandOptionAllowedChannelTypes,
    ApplicationCommandOptionType,
    SlashCommandChannelOption
} from 'discord.js';

export class ChannelOption extends BaseOptionBuilder<SlashCommandChannelOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Channel, baseKey);
        this.builder = new SlashCommandChannelOption();
    }

    setChannelTypes(...types: ApplicationCommandOptionAllowedChannelTypes[]) {
        this.builder.addChannelTypes(...types);
        return this;
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
