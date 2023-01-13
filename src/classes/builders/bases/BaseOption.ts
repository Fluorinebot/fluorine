import { BaseBuilder } from '#builders';
import type { OptionResolvable } from '#types';
import type { ApplicationCommandOptionType } from 'discord.js';

export class BaseOption<T extends OptionResolvable> extends BaseBuilder<T> {
    constructor(public type: ApplicationCommandOptionType, baseKey: string) {
        super();
        this.type = type;
        this.baseKey = baseKey;
    }

    setRequired(bool: boolean) {
        this.builder.setRequired(bool);
        return this;
    }
}
