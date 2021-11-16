import AlcanClient from '@classes/Client';
import { inspect } from 'util';
export default async function clean(
  client: AlcanClient,
  text: any
): Promise<string> {
  const inspectedText = inspect(await text, { depth: 1 });
  return inspectedText.replaceAll(client.token, 'ok');
}
