import {
    type ApplicationCommandOptionAllowedChannelTypes,
    ApplicationCommandOptionType,
    SlashCommandChannelOption
} from 'discord.js';
import { BaseOption } from '#builders';

export class ChannelOption extends BaseOption<SlashCommandChannelOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.Channel, baseKey);
        this.builder = new SlashCommandChannelOption();
    }

    setChannelTypes(...types: ApplicationCommandOptionAllowedChannelTypes[]) {
        this.builder.addChannelTypes(...types);
        return this;
    }
}
