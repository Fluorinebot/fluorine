import { join } from 'path';
import { lstat, readdir } from 'fs/promises';

export async function loadParentDirectory<ParentT, ChildT>(relativePath: string) {
    type Child = { name: string; data: ChildT };
    const result: [ParentT[], Child[]] = [[], []];

    const parentDirectory = join(__dirname, relativePath);
    const parentFiles = await readdir(parentDirectory);
    for (const parentFile of parentFiles) {
        if (parentFile.endsWith('.js')) {
            result[0].push((await loadFile<ParentT>(relativePath, parentFile)).data);
        } else {
            const directory = join(parentDirectory, parentFile);
            const file = await lstat(directory);

            if (file.isDirectory()) {
                const relativeDirectory = join(relativePath, parentFile);
                result[1].push(
                    ...(await loadDirectory<ChildT>(relativeDirectory)).map(data => ({
                        name: `${parentFile}/${data.name}`,
                        data: data.data
                    }))
                );
            }
        }
    }

    return result;
}

export async function loadDirectory<T>(relativePath: string) {
    const directory = join(__dirname, relativePath);

    const files = await readdir(directory);
    return Promise.all(files.map(async file => loadFile<T>(directory, file)));
}

export async function loadFile<T>(directory: string, file: string) {
    if (!file.endsWith('.js')) {
        return;
    }
    const [name] = file.split('.');
    const data: T = await import(join(directory, file));

    return { name, data };
}
