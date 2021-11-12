import axios, { Axios, AxiosResponse } from "axios";
import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { TextChannel } from "discord.js";

export default class AI extends Array {
    constructor() {
        super();
    }
    async add(
        client: AlcanClient,
        user: string,
        msg: string,
        text: string,
        channel: string
    ) {
        this.push({ user, msg, text, channel });
    }

    async generate(client: AlcanClient, obj: any) {
        // @ts-ignore

        let request = await axios.get(
            `${client.config.aiurl}/?topic=${obj.text}`
        );

        const text = request?.data.text;
        const embed = new Embed()
            .setTitle("Wygenerowano!")
            .setDescription("Twój tekst:\n" + text)
            .setFooter(client.footer);
        this.shift();

        const channel = (await client.channels.cache.get(
            obj.channel
        )) as TextChannel;
        channel.messages.cache.get(obj.msg).reply({ embeds: [embed] });
        if (this.length > 1) {
            this.generate(client, this[0]);
        }
    }
}
