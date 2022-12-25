import { BaseBuilder } from '#builders';
import type { LocalizationMap } from 'discord.js';

export class Choice<T> extends BaseBuilder<null> {
    public name: string;
    public name_localizations: LocalizationMap;
    public value: T;

    constructor() {
        // i know this makes no sense but choice is not a pre-existing djs builder
        super(false, null);
    }

    override setName(name: string) {
        this.name = this.getDefault(name);
        this.name_localizations = this.getLocalizations(name);
        return this;
    }

    setValue(value: T) {
        this.value = value;
        return this;
    }

    override toJSON() {
        return {
            name: this.name,
            name_localizations: this.name_localizations,
            value: this.value
        };
    }
}
