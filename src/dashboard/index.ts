import express from 'express'; 
import AlcanClient from '@classes/Client';

export default class Dashboard {
  app: express.Express;
    client: AlcanClient;
  constructor(client: AlcanClient) {
    this.app = express();
    this.client = client;
    this.app.get('/', (req, res) => {
      res.send(client.user?.username);
    });
}
    listen() {
        this.app.listen(3000, () => {
            this.client.logger.log(`Dashboard is now running on port 3000!`);
        });
    }
}   
