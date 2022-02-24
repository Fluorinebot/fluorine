import { SlashCommandBuilder } from '@discordjs/builders';
import { Category } from 'types/applicationCommand';
export const data = new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Buy something with your economy money!')
    .addSubcommand(command => command.setName('list').setDescription('List all items in the shop'))
    .addSubcommand(command =>
        command
            .setName('buy')
            .setDescription('Buy an item from the shop')
            .addStringOption(option =>
                option.setName('item').setDescription('The item you want to buy').setRequired(true)
            )
    )
    .addSubcommand(command =>
        command
            .setName('create')
            .setDescription('Create a item!')
            .addStringOption(option => option.setName('name').setDescription('Name of the item').setRequired(true))
            .addStringOption(option =>
                option.setName('description').setDescription('Description of the item').setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('price').setDescription('price of the item').setMinValue(1).setRequired(true)
            )
            .addRoleOption(option =>
                option.setName('role').setDescription('The role you want to give').setRequired(false)
            )
    )

    .addSubcommand(command =>
        command
            .setName('delete')
            .setDescription('Delete a item from the shop')
            .addStringOption(option => option.setName('name').setDescription('Name of the item').setRequired(true))
    );
export const category: Category = 'economy';
