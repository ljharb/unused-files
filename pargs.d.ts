export type ExtractIterable<T> = T extends Iterable<infer U> ? U : never;

export type GroupedByString<T> = { [k: string]: null | T[] };

declare function groupByString<T>(iterable: Iterable<T>, cb: (item: T) => string): GroupedByString<T>;