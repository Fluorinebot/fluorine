import axios, { Axios, AxiosResponse } from "axios";
import AlcanClient from "@classes/Client";
import Embed from "@classes/Embed";
import { TextChannel } from "discord.js";

export default class AI extends Array {
    isGenerating: boolean;
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
        this.isGenerating = false;
    }

    async generate(client: AlcanClient, obj: any) {
        // @ts-ignore
        this.isGenerating = true;
        let url = await axios.get(
            `${client.config.aiurls[0]}?token=${client.config.aitoken}`,
            {
                validateStatus: function (s) {
                    return s < 503;
                },
            }
        );
        let request = await axios
            .get(
                `${url.data.text}/?token=${client.config.aitoken}&topic=${obj.text}`
            )
            .catch(() => {
                this.isGenerating = false;
            });
        // @ts-ignore
        const text = request?.data.text;
        const embed = new Embed()
            .setTitle("Wygenerowano!")
            .setDescription("Twój tekst:\n" + text)
            .setFooter(client.footer);
        this.shift();
        // @ts-ignore
        console.log(request.data);
        const channel = (await client.channels.cache.get(
            obj.channel
        )) as TextChannel;
        channel.messages.cache.get(obj.msg).reply({ embeds: [embed] });
        if (this.length > 1) {
            this.generate(client, this[0]);
        }
        this.isGenerating = false;
    }
}
