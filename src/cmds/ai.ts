import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { Message } from "discord.js";
export async function run(
    client: AlcanClient,
    message: Message,
    args: string[]
) {
    const text = args.join(" ");
    if (!args[0]) return message.reply("Musisz podać tekst!");
    client.ai.add(
        client,
        message.author.id,
        message.id,
        encodeURIComponent(text),
        message.channel.id
    );
    let queue = client.ai.length;
    if (queue === 0) queue = 1;
    message.reply(
        `Jesteś ${queue} w kolejce. Poczekaj na wygenerowanie wiadomości.`
    );
    client.ai.generate(client, client.ai[0]);
}
export const help = {
    name: "ai",
    description: "Wygeneruj wiadomość za pomocą sztucznej inteligencji!",
    aliases: ["si"],
    category: "tools",
};
