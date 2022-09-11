import type { FluorineClient } from '#classes';
import { inspect } from 'util';

export async function clean(client: FluorineClient, text: unknown): Promise<string> {
    const inspectedText = inspect(await text, { depth: 1 });
    return inspectedText.replaceAll(client.token, 'ok');
}
