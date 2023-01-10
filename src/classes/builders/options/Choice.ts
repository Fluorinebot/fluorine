import { BaseBuilder } from '#builders';
import type { LocalizationMap } from 'discord.js';

export class Choice<T> extends BaseBuilder<null> {
    public name: string;
    public name_localizations: LocalizationMap;
    public value: T;

    constructor(baseKey: string, value: T) {
        // i know this makes no sense but choice is not a pre-existing djs builder
        super(false, null);

        this.name = this.getDefault(`${baseKey}.${value.toString().toUpperCase()}`);
        this.name_localizations = this.getLocalizations(`${baseKey}.${value.toString().toUpperCase()}`);
        this.value = value;
    }

    override toJSON() {
        return {
            name: this.name,
            name_localizations: this.name_localizations,
            value: this.value
        };
    }
}
