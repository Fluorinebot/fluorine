import { BaseBuilder } from '#builders';
import type { OptionResolvable } from '#types';
import type { ApplicationCommandOptionType } from 'discord.js';

export class BaseOption<T extends OptionResolvable> extends BaseBuilder<T> {
    constructor(public type: ApplicationCommandOptionType) {
        super(false, type);
    }

    setRequired(bool: boolean) {
        this.builder.setRequired(bool);
        return this;
    }

    setDescription(desc: string) {
        this.builder.setDescription(this.getDefault(desc));
        this.builder.setDescriptionLocalizations(this.getLocalizations(desc));
    }
}
