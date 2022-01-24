import FluorineClient from '@classes/Client';
import Dashboard from '@dash/index';
const client = new FluorineClient();
client.init();
new Dashboard(client).listen(3002);
