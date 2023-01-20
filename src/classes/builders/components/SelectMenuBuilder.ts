import { BaseComponent } from '#builderBases';
import type { SelectMenuOptionBuilder } from '#components';
import { SelectMenuBuilder as UnlocalizedBuilder, type LocalizationMap } from 'discord.js';

export class SelectMenuBuilder extends BaseComponent<UnlocalizedBuilder> {
    placeholder: string;
    options: SelectMenuOptionBuilder[];

    constructor(customId: string) {
        super();
        this.builder = new UnlocalizedBuilder().setCustomId(customId);
        this.options = [];
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    setDisabled(disabled = true) {
        this.builder.setDisabled(disabled);
        return this;
    }

    setMaxValues(maxValues: number) {
        this.builder.setMaxValues(maxValues);
        return this;
    }

    setMinValues(minValues: number) {
        this.builder.setMinValues(minValues);
        return this;
    }

    setOptions(...options: SelectMenuOptionBuilder[]) {
        this.options = options;
        return this;
    }

    addOptions(...options: SelectMenuOptionBuilder[]) {
        this.options.push(...options);
    }

    prepare(locale: keyof LocalizationMap) {
        if (this.placeholder) {
            this.builder.setPlaceholder(this.getOne(this.placeholder, locale));
        }

        this.builder.setOptions(this.options.map(option => option.prepare(locale).builder));

        this.options = [];
        return this;
    }
}
