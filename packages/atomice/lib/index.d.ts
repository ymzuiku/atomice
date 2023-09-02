import { ReactNode } from "react";
export interface Atom<T> {
    value: T;
    getDefaultValue: () => T;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    addBefore: (fn: () => Promise<void>) => void;
    addAfter: (fn: () => void) => void;
    Render: (props: {
        children?: (value: T) => ReactNode;
    }) => ReactNode;
    loadStorage: () => void;
}
export interface AtomOptions {
    after?: () => void;
    before?: () => Promise<void>;
}
export declare function atomWithStorage<T>(storageKey: string, defaultValue: T, option?: AtomOptions & {
    storage?: "localStorage" | "sessionStorage";
    saveStorage?: (value: T) => void;
    loadStorage?: (key: string) => Promise<T>;
}): Atom<T>;
export declare function atom<T>(defaultValue: T, options?: AtomOptions): Atom<T>;
export declare function onStorageLoaded(fn: () => void): void;
export declare function Block({ children }: {
    children: ReactNode;
}): ReactNode;
export declare function staticComponent<T>(fn: T): T;
