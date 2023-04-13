import { BaseBuilder } from '#builderBases';
import type { ApplicationCommandBuilderResolvable } from '#types';
import { type ApplicationCommandOptionType, type ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';

export class BaseApplicationCommandBuilder<T extends ApplicationCommandBuilderResolvable> extends BaseBuilder<T> {
    public builder: T;
    public baseKey: string;
    public type: ApplicationCommandOptionType | ApplicationCommandType;

    constructor() {
        super('commands');
    }

    setName(_name: string) {
        const name = this.builder instanceof ContextMenuCommandBuilder ? `${_name}.CONTEXT` : `${_name}.NAME`;

        this.builder.setName(this.getDefault(name));
        this.builder.setNameLocalizations(this.getLocalizations(name));
        return this;
    }

    setDescription(description: string) {
        if (this.builder instanceof ContextMenuCommandBuilder) {
            return;
        }

        this.builder.setDescription(this.getDefault(`${description}.DESCRIPTION`));
        this.builder.setDescriptionLocalizations(this.getLocalizations(`${description}.DESCRIPTION`));
        return this;
    }

    setBaseKey(key: string) {
        this.baseKey = key;

        this.setName(this.baseKey);
        this.setDescription(this.baseKey);

        return this;
    }
}
