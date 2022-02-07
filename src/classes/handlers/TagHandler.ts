import FluorineClient from '@classes/Client';
import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { Tag } from 'types/tag';

// This is still a dev build of the parser. Don't try to mess with it.
// Just wait for slate V2.

export default class TagHandler {
    client: FluorineClient;
    constructor(client) {
        this.client = client;
    }

    getParsingFunctions(type: 'variables' | 'functions') {
        const returnables = {
            variables: {
                interUserTag: (interaction: CommandInteraction) =>
                    interaction.user.tag,
                interUserName: (interaction: CommandInteraction) =>
                    interaction.user.username,
                interUserPing: (interaction: CommandInteraction) =>
                    interaction.user.toString()
            },
            functions: {
                rand: (interaction: CommandInteraction, params: string[]) => {
                    const min = parseInt(params[0]);
                    const max = parseInt(params[1]);
                    return Math.floor(Math.random() * (max - min)) + min;
                },
                choose: (interaction: CommandInteraction, params: string[]) => {
                    const cleanParams = params.map(param =>
                        this.getParsedStaticVars(
                            param.replaceAll('--', ' '),
                            '$',
                            '$',
                            interaction
                        )
                    );

                    return cleanParams[
                        Math.floor(Math.random() * cleanParams.length)
                    ];
                },
                user: async (
                    interaction: CommandInteraction,
                    params: string[]
                ) => {
                    const user = await this.client.users.fetch(params[0]);

                    const customVarmap = {
                        userTag: user.tag,
                        userName: user.username,
                        userPing: user.toString()
                    };

                    return customVarmap[params[1]];
                }
            }
        };

        return returnables[type];
    }

    splitForActions(content: string): string[] {
        return content.split(/[{}]/u);
    }

    async getParsedStaticVars(
        content: string,
        start: string,
        end: string,
        interaction: CommandInteraction
    ) {
        let returnString = content;

        for (const [key, value] of Object.entries(
            this.getParsingFunctions('variables')
        )) {
            returnString = returnString.replaceAll(
                `${start}${key}${end}`,
                await value(interaction, [])
            );
        }

        return returnString;
    }

    getParsedTagContent(tagContent: string, interaction: CommandInteraction) {
        let returnString = tagContent;
        const specialParse = this.getParsingFunctions('functions');
        const reserved = ['rand', 'choose', 'user'];

        const toVar = this.splitForActions(returnString);

        for (const elem of toVar) {
            const [action, props] = elem.split(':');
            if (reserved.includes(action)) {
                const params = props.split('|');
                const method = specialParse[action];

                returnString = returnString.replace(
                    `{${elem}}`,
                    method(interaction, params)
                );
            }
        }

        return returnString;
    }

    getParsedReplyOptions(tag: Tag, interaction: CommandInteraction) {
        const replyOptions: InteractionReplyOptions = {};
        const tagString = tag.content;
        const [tagContent] = tagString.split('@embed');

        if (tagContent)
            replyOptions.content = this.getParsedTagContent(
                tagContent,
                interaction
            );

        replyOptions.ephemeral = tag.ephemeral;
        return replyOptions;
    }
}
