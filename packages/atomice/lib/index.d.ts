import { ReactNode } from "react";
export interface Atom<T> {
    value: T;
    getDefaultValue: () => T;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    listen: (fn: (value: T) => void | Promise<void>) => void;
    Render: (props: {
        children?: (value: T, setValue: React.Dispatch<React.SetStateAction<T>>) => any;
    }) => any;
    loadStorage: () => void;
}
export interface AtomOptions<T> {
    storageType?: "localStorage" | "sessionStorage";
    saveStorage?: (value: T) => void;
    loadStorage?: (key: string) => Promise<T>;
}
export declare function atomWithStorage<T>(storageKey: string, defaultValue: T, option?: AtomOptions<T>): Atom<T>;
export declare function atom<T>(defaultValue: T): Atom<T>;
export declare function useAtom<T>(at: Atom<T>): readonly [T, import("react").Dispatch<import("react").SetStateAction<T>>];
export declare function useAtomValue<T>(at: Atom<T>): T;
export declare function onStorageLoaded(fn: () => void): void;
export declare function Block({ children }: {
    children: ReactNode;
}): ReactNode;
export declare function staticComponent<T>(fn: T): T;
export declare function onMount(fn: () => void): void;
export declare function atomWithComputed<T>(fn: () => T, depend: Atom<any>[]): Atom<T>;
