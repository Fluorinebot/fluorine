import AlcanClient from "@classes/Client";
import dashboard from "@dash/index";
const client = new AlcanClient()
client.init()
new dashboard(client).listen()