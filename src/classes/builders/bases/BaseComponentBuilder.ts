import type { ComponentResolvable } from '#types';
import type { LocalizationMap, ComponentType } from 'discord.js';
import { BaseBuilder } from '#builderBases';

export class BaseComponentBuilder<T extends ComponentResolvable> extends BaseBuilder<T> {
    public type: ComponentType;

    constructor() {
        super('responses');
    }

    prepare(locale: keyof LocalizationMap): this {
        locale;
        return this;
    }
}
