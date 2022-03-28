export function splitArray<T>(array: T[], chunkSize: number) {
    const _chunkSize = chunkSize - 1;

    return array.reduce<T[][]>((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / _chunkSize);

        resultArray[chunkIndex] ||= [];
        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
}
