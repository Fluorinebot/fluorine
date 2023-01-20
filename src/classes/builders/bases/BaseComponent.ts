import type { ComponentResolvable } from '#types';
import type { LocalizationMap, ComponentType } from 'discord.js';
import { BaseBuilder } from './BaseBuilder';

export class BaseComponent<T extends ComponentResolvable> extends BaseBuilder<T> {
    public type: ComponentType;

    constructor() {
        super('responses');
    }

    prepare(locale: keyof LocalizationMap): this {
        locale;
        return this;
    }
}
