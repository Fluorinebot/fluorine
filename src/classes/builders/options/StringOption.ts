import { BaseOptionBuilder } from '#builderBases';
import { ApplicationCommandOptionType, SlashCommandStringOption } from 'discord.js';

export class StringOption extends BaseOptionBuilder<SlashCommandStringOption> {
    choiceQueue: string[];

    constructor(baseKey: string) {
        super(ApplicationCommandOptionType.String, baseKey);
        this.builder = new SlashCommandStringOption();
        this.choiceQueue = [];
    }

    setMaxLength(num: number) {
        this.builder.setMaxLength(num);
        return this;
    }

    setMinLength(num: number) {
        this.builder.setMinLength(num);
        return this;
    }
    setAutocomplete(bool: boolean) {
        this.builder.setAutocomplete(bool);
        return this;
    }

    addChoices(...choices: string[]) {
        this.choiceQueue = choices;
        return this;
    }

    prepareChoices() {
        const preparedChoices = this.choiceQueue.map((value: string) => {
            const name = this.getDefault(`${this.baseKey}.CHOICES.${value.toString().toUpperCase()}`);
            const name_localizations = this.getLocalizations(
                `${this.baseKey}.CHOICES.${value.toString().toUpperCase()}`
            );

            return {
                name,
                name_localizations,
                value
            };
        });

        this.choiceQueue = [];
        this.builder.addChoices(...preparedChoices);
        return this;
    }

    toJSON() {
        return this.builder.toJSON();
    }
}
