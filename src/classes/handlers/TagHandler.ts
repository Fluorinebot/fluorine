import FluorineClient from '@classes/Client';
import { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import r from 'rethinkdb';
import { Tag } from 'types/tag';

// This is a development version of the parser.
// It will be rewritten with the Slate V2 update.
export default class TagHandler {
    client: FluorineClient;
    constructor(client) {
        this.client = client;
    }

    async get(interaction: CommandInteraction, name: string): Promise<Tag> {
        const tag = await r
            .table('tags')
            .get(`${interaction.guild.id}-${name}`)
            .run(this.client.conn);

        return tag as Tag;
    }

    functionObjects(type: 'variables' | 'functions') {
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
                    const cleanParams = [];

                    for (const param of params) {
                        cleanParams.push(
                            this.parseVars(
                                param.replaceAll('--', ' '),
                                '$',
                                '$',
                                interaction
                            )
                        );
                    }

                    return cleanParams[
                        Math.floor(Math.random() * cleanParams.length)
                    ];
                },
                user: (interaction: CommandInteraction, params: string[]) => {
                    const user = this.client.users.cache.get(params[0]);

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

    parseMethods(text: string): string[] {
        const checkReserved = text.split('{');
        const strippedVars = checkReserved.map(x => x.split('}'));
        const workingArr = [];
        for (const arr of strippedVars) {
            for (const elem of arr) {
                workingArr.push(elem);
            }
        }
        return workingArr;
    }

    parseVars(
        content: string,
        start: string,
        end: string,
        interaction: CommandInteraction
    ) {
        let returnString = content;

        for (const [key, value] of Object.entries(
            this.functionObjects('variables')
        )) {
            returnString = returnString.replaceAll(
                `${start}${key}${end}`,
                value(interaction, [])
            );
        }

        return returnString;
    }

    parseContent(tagContent: string, interaction: CommandInteraction) {
        let returnString = tagContent;

        const specialParse = this.functionObjects('functions');
        const reserved = ['rand', 'choose', 'user'];
        const toVar = this.parseMethods(returnString);

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

    parse(tag: Tag, interaction: CommandInteraction) {
        const replyOptions: InteractionReplyOptions = {};
        const tagString = tag.content;
        const [tagContent] = tagString.split('$e.start');

        if (tagContent)
            replyOptions.content = this.parseContent(tagContent, interaction);

        replyOptions.ephemeral = tag.ephemeral;
        return replyOptions;
    }
}
