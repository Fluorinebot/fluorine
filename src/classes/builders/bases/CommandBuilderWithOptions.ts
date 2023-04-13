import { BaseCommandBuilder, type BaseOptionBuilder } from '#builderBases';
import {
    AttachmentOption,
    BooleanOption,
    ChannelOption,
    IntegerOption,
    MentionableOption,
    NumberOption,
    RoleOption,
    StringOption,
    UserOption
} from '#options';
import type { OptionResolvable } from '#types';
import {
    type ApplicationCommandOptionType,
    type ApplicationCommandType,
    SlashCommandBuilder,
    type SlashCommandSubcommandBuilder
} from 'discord.js';

export class CommandBuilderWithOptions<
    T extends SlashCommandBuilder | SlashCommandSubcommandBuilder
> extends BaseCommandBuilder<T> {
    public optionQueue: BaseOptionBuilder<OptionResolvable>[];

    constructor(type: ApplicationCommandType.ChatInput | ApplicationCommandOptionType.Subcommand, baseKey: string) {
        super(type, baseKey);
        this.optionQueue = [];
    }

    private addOption<T extends OptionResolvable>(input: BaseOptionBuilder<T>) {
        if (this.builder instanceof SlashCommandBuilder) {
            this.mapOption(input);
        }

        this.optionQueue.push(input);
    }

    private mapOption<T extends OptionResolvable>(option: BaseOptionBuilder<T>) {
        option.setBaseKey(`${this.baseKey}.OPTIONS.${option.baseKey}`);

        if (option instanceof AttachmentOption) {
            this.builder.addAttachmentOption(option.builder);
        } else if (option instanceof BooleanOption) {
            this.builder.addBooleanOption(option.builder);
        } else if (option instanceof ChannelOption) {
            this.builder.addChannelOption(option.builder);
        } else if (option instanceof IntegerOption) {
            this.builder.addIntegerOption(option.prepareChoices().builder);
        } else if (option instanceof MentionableOption) {
            this.builder.addMentionableOption(option.builder);
        } else if (option instanceof NumberOption) {
            this.builder.addNumberOption(option.prepareChoices().builder);
        } else if (option instanceof RoleOption) {
            this.builder.addRoleOption(option.builder);
        } else if (option instanceof StringOption) {
            this.builder.addStringOption(option.prepareChoices().builder);
        } else if (option instanceof UserOption) {
            this.builder.addUserOption(option.builder);
        }
    }

    addAttachmentOption(key: string, input: (option: AttachmentOption) => AttachmentOption = (option) => option) {
        this.addOption(input(new AttachmentOption(key)));
        return this;
    }

    addBooleanOption(key: string, input: (option: BooleanOption) => BooleanOption = (option) => option) {
        this.addOption(input(new BooleanOption(key)));
        return this;
    }

    addChannelOption(key: string, input: (option: ChannelOption) => ChannelOption = (option) => option) {
        this.addOption(input(new ChannelOption(key)));
        return this;
    }

    addIntegerOption(key: string, input: (option: IntegerOption) => IntegerOption = (option) => option) {
        this.addOption(input(new IntegerOption(key)));
        return this;
    }

    addMentionableOption(key: string, input: (option: MentionableOption) => MentionableOption = (option) => option) {
        this.addOption(input(new MentionableOption(key)));
        return this;
    }

    addNumberOption(key: string, input: (option: NumberOption) => NumberOption = (option) => option) {
        this.addOption(input(new NumberOption(key)));
        return this;
    }

    addRoleOption(key: string, input: (option: RoleOption) => RoleOption = (option) => option) {
        this.addOption(input(new RoleOption(key)));
        return this;
    }

    addStringOption(key: string, input: (option: StringOption) => StringOption = (option) => option) {
        this.addOption(input(new StringOption(key)));
        return this;
    }

    addUserOption(key: string, input: (option: UserOption) => UserOption = (option) => option) {
        this.addOption(input(new UserOption(key)));
        return this;
    }

    prepareOptions() {
        for (const option of this.optionQueue) {
            this.mapOption(option);
        }

        this.optionQueue = [];

        return this;
    }
}
