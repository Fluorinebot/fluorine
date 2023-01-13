import {
    BaseBuilder
    //     AttachmentOption,
    //     BooleanOption,
    //     ChannelOption,
    //     IntegerOption,
    //     MentionableOption,
    //     NumberOption,
    //     RoleOption,
    //     StringOption,
    //     UserOption
} from '#builders';

import type { CommandResolvable } from '#types';
import type { ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

export class BaseCommand<T extends CommandResolvable> extends BaseBuilder<T> {
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
