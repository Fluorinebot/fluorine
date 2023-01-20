import { BaseApplicationCommandBuilder } from '#builderBases';
import type { CommandResolvable } from '#types';
import type { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

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
}
