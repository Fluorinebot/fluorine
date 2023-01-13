import { ApplicationCommandOptionType, SlashCommandStringOption } from 'discord.js';
import { OptionWithAutocomplete } from '#builders';

export class StringOption extends OptionWithAutocomplete<SlashCommandStringOption> {
    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.String, baseKey);
        this.builder = new SlashCommandStringOption();
    }

    setMaxLength(num: number) {
        this.builder.setMaxLength(num);
        return this;
    }

    setMinLength(num: number) {
        this.builder.setMinLength(num);
        return this;
    }
}
