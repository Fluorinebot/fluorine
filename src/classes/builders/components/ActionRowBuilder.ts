import { BaseComponentBuilder } from '#builderBases';
import type { ButtonBuilder, SelectMenuBuilder } from '#components';
import {
    ActionRowBuilder as UnlocalizedBuilder,
    type ButtonBuilder as DjsButtonBuilder,
    type LocalizationMap,
    type SelectMenuBuilder as DjsSelectMenuBuilder
} from 'discord.js';

export class ActionRowBuilder extends BaseComponentBuilder<
    UnlocalizedBuilder<DjsButtonBuilder | DjsSelectMenuBuilder>
> {
    public locale: keyof LocalizationMap;

    constructor(locale: keyof LocalizationMap) {
        super();
        this.locale = locale;
        this.builder = new UnlocalizedBuilder();
    }

    addComponents(components: (ButtonBuilder | SelectMenuBuilder)[]) {
        this.builder.addComponents(components.map(builder => builder.prepare(this.locale).builder));
        return this;
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
