import { BaseBuilder } from '#builderBases';
import type { ComponentResolvable } from '#types';
import type { ComponentType, LocalizationMap } from 'discord.js';

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
