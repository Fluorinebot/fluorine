import { join } from 'path';
import { readdir } from 'fs/promises';

export async function loadDirectory<T>(relativePath: string) {
    const directory = join(__dirname, relativePath);

    const files = await readdir(directory);
    return Promise.all(files.map(async file => loadFile<T>(directory, file)));
}

export async function loadFile<T>(directory: string, file: string) {
    if (!file.endsWith('.js')) {
        return;
    }
    const data: T = await import(join(directory, file));

    return data;
}
