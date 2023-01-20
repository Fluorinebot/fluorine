import { ActionRowBuilder as UnlocalizedBuilder, type LocalizationMap } from 'discord.js';
import { BaseComponent } from '#builderBases';
import type { ButtonBuilder, SelectMenuBuilder } from '#components';

export class ActionRowBuilder extends BaseComponent<UnlocalizedBuilder> {
    public locale: keyof LocalizationMap;

    constructor(locale: keyof LocalizationMap) {
        super();
        this.locale = locale;
        this.builder = new UnlocalizedBuilder();
    }

    addComponents(...components: (ButtonBuilder | SelectMenuBuilder)[]) {
        this.builder.addComponents(...components.map(builder => builder.prepare(this.locale).builder));
        return this.builder;
    }
}
