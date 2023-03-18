import { BaseApplicationCommandBuilder } from '#builderBases';
import type { CommandResolvable } from '#types';
import { ContextMenuCommandBuilder, type ApplicationCommandOptionType, type ApplicationCommandType } from 'discord.js';

export class BaseCommandBuilder<T extends CommandResolvable> extends BaseApplicationCommandBuilder<T> {
    constructor(
        public type:
            | ApplicationCommandType
            | ApplicationCommandOptionType.Subcommand
            | ApplicationCommandOptionType.SubcommandGroup,
        public baseKey: string
    ) {
        super();
        this.type = type;
        this.baseKey = baseKey;
    }

    get name() {
        return this.builder.name;
    }

    get description() {
        if (this.builder instanceof ContextMenuCommandBuilder) {
            return;
        }

        return this.builder.description;
    }

    get nameLocalizations() {
        return this.builder.name_localizations;
    }

    get descriptionLocalizations() {
        if (this.builder instanceof ContextMenuCommandBuilder) {
            return;
        }

        return this.builder.description_localizations;
    }
}
