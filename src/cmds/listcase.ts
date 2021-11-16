import AlcanClient from '@classes/Client';
import Embed from '@classes/Embed';
import getCases from '@util/getCases';
import { Message, MessageActionRow, MessageButton } from 'discord.js';

export async function run(
  client: AlcanClient,
  message: Message,
  args: string[]
) {
  const row = new MessageActionRow();
  const member =
    message.mentions.members?.first() ||
    message.guild?.members.cache.get(args[0]) ||
    message.member;

  const cases = await getCases(client, message.guild?.id, member?.id);
  const embed = new Embed()
    .setTitle('Historia kar dla użytkownika')
    .setThumbnail(member?.user.displayAvatarURL({ dynamic: true }))
    .setFooter(
      `Więcej informacji otrzymasz za pomocą komendy case | ${client.footer}`
    );

  let caseLength;

  if (cases.length < 10) caseLength = cases.length;
  else caseLength = 10;
  let start = 0;
  let page = 1;
  const lastPage = Math.round(cases.length / 10) + 1;
  for (let i = start; i < caseLength; i++) {
    const Case = cases[i];
    embed.addField(`#${Case.id} ${Case.type}`, Case.dscp);
  }
  if (page === 1) {
    row.addComponents(
      new MessageButton()
        .setCustomId('back')
        .setLabel('Poprzednia strona')
        .setStyle('PRIMARY')
        .setDisabled(true)
    );
  } else {
    row.addComponents(
      new MessageButton()
        .setCustomId('back')
        .setLabel('Poprzednia strona')
        .setStyle('PRIMARY')
    );
  }
  if (page === lastPage) {
    row.addComponents(
      new MessageButton()
        .setCustomId('next')
        .setLabel('Następna strona')
        .setStyle('PRIMARY')
        .setDisabled(true)
    );
  } else {
    row.addComponents(
      new MessageButton()
        .setCustomId('next')
        .setLabel('Następna strona')
        .setStyle('PRIMARY')
    );
  }
  const msg = await message.reply({ embeds: [embed], components: [row] });
  const collector = msg.createMessageComponentCollector({
    componentType: 'BUTTON',
    time: 30000
  });
  collector.on('collect', interaction => {
    if (interaction.user.id === message.author.id) {
      if (interaction.customId === 'next') {
        page++;
        caseLength = page * 10;
        start = caseLength - 10;

        const nextEmbed = new Embed()
          .setTitle('Historia kar dla użytkownika')
          .setFooter(
            `Więcej informacji otrzymasz za pomocą komendy a!case | ${
              client.footer}`
          );

        for (let i = start; i < caseLength; i++) {
          const Case = cases[i];
          if (Case) {
            embed.addField(`#${Case.id} ${Case.type}`, Case.dscp);
          }
        }

        const nextrow = new MessageActionRow();
        if (page === 1) {
          nextrow.addComponents(
            new MessageButton()
              .setCustomId('back')
              .setLabel('Poprzednia strona')
              .setStyle('PRIMARY')
              .setDisabled(true)
          );
        } else {
          nextrow.addComponents(
            new MessageButton()
              .setCustomId('back')
              .setLabel('Poprzednia strona')
              .setStyle('PRIMARY')
          );
        }
        if (page === lastPage) {
          nextrow.addComponents(
            new MessageButton()
              .setCustomId('next')
              .setLabel('Następna strona')
              .setStyle('PRIMARY')
              .setDisabled(true)
          );
        } else {
          nextrow.addComponents(
            new MessageButton()
              .setCustomId('next')
              .setLabel('Następna strona')
              .setStyle('PRIMARY')
          );
        }

        interaction.update({ embeds: [nextEmbed], components: [nextrow] });
      } else if (interaction.customId === 'back') {
        page--;
        caseLength = page * 10;
        start = caseLength - 10;
        const backEmbed = new Embed()
          .setTitle('Historia kar dla użytkownika')
          .setFooter(
            `Więcej informacji otrzymasz za pomocą komendy a!case | ${
              client.footer}`
          );

        for (let i = start; i < caseLength; i++) {
          const Case = cases[i];
          if (Case) {
            embed.addField(`#${Case.id} ${Case.type}`, Case.dscp);
          }
        }
        const backrow = new MessageActionRow();
        if (page === 1) {
          backrow.addComponents(
            new MessageButton()
              .setCustomId('back')
              .setLabel('Poprzednia strona')
              .setStyle('PRIMARY')
              .setDisabled(true)
          );
        } else {
          backrow.addComponents(
            new MessageButton()
              .setCustomId('back')
              .setLabel('Poprzednia strona')
              .setStyle('PRIMARY')
          );
        }
        if (page === lastPage) {
          backrow.addComponents(
            new MessageButton()
              .setCustomId('next')
              .setLabel('Następna strona')
              .setStyle('PRIMARY')
              .setDisabled(true)
          );
        } else {
          backrow.addComponents(
            new MessageButton()
              .setCustomId('next')
              .setLabel('Następna strona')
              .setStyle('PRIMARY')
          );
        }

        interaction.update({ embeds: [backEmbed], components: [backrow] });
      }
    } else {
      interaction.reply({
        content: 'Nie możesz korzystać z tych przycisków!',
        ephemeral: true
      });
    }
  });
}
export const help = {
  name: 'listcase',
  description: 'Sprawdź kary użytkownika',
  aliases: ['list-case', 'cases', 'kary'],
  category: 'mod'
};
