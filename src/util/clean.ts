import FluorineClient from '@classes/Client';
import { inspect } from 'util';

export async function clean(client: FluorineClient, text: any): Promise<string> {
    const inspectedText = inspect(await text, { depth: 1 });
    return inspectedText.replaceAll(client.token, 'ok');
}
