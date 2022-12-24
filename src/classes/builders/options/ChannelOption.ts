import {
    type ApplicationCommandOptionAllowedChannelTypes,
    ApplicationCommandOptionType,
    SlashCommandChannelOption
} from 'discord.js';
import { BaseOption } from './BaseOption';

export class ChannelOption extends BaseOption<SlashCommandChannelOption> {
    constructor() {
        super(ApplicationCommandOptionType.Channel);
        this.builder = new SlashCommandChannelOption();
    }

    setChannelTypes(...types: ApplicationCommandOptionAllowedChannelTypes[]) {
        this.builder.addChannelTypes(...types);
    }
}
