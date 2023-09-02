/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, memo, useEffect, useMemo, useRef, useState } from "react";

const isSSR = typeof window === "undefined";

export interface Atom<T> {
  value: T;
  getDefaultValue: () => T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  addBefore: (fn: () => Promise<void>) => void;
  addAfter: (fn: () => void) => void;
  Render: (props: { children?: (value: T) => ReactNode }) => ReactNode;
  loadStorage: () => void;
}

interface PrivateAtom<T> extends Atom<T> {
  events: Set<React.Dispatch<React.SetStateAction<T>>>;
}

let rended = false;
export interface AtomOptions {
  after?: () => void;
  before?: () => Promise<void>;
}

export function atomWithStorage<T>(
  storageKey: string,
  defaultValue: T,
  option: AtomOptions & {
    storage?: "localStorage" | "sessionStorage";
    saveStorage?: (value: T) => void;
    loadStorage?: (key: string) => Promise<T>;
  } = {}
) {
  const eventBefores: any = [];
  const eventAfters: any = [];
  const defaultValueString = JSON.stringify({ v: defaultValue });
  let storageLoaded = false;
  const at = {
    value: defaultValue,
    events: new Set([]),
    setValue: () => {},
    loadStorage: async () => {},
    getDefaultValue: () => JSON.parse(defaultValueString).v,
    addAfter: (fn) => {
      eventAfters.push(fn);
    },
    addBefore: (fn) => {
      eventBefores.push(fn);
    },
    Render: ({ children }: { children: any }) => {
      return children(defaultValue);
    },
  } as PrivateAtom<T>;

  if (option.after) {
    at.addAfter(option.after);
  }
  if (option.before) {
    at.addBefore(option.before);
  }

  at.Render = staticComponent(({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBeforeRender(at);
    if (!children) {
      return at.value as ReactNode;
    }
    return children(at.value);
  });

  at.setValue = async (value: any) => {
    if (typeof value === "function") {
      value = value(at.value);
    }
    if (value === at.value) {
      return;
    }
    at.value = value;

    for (const fn of eventBefores) {
      await Promise.resolve(fn());
    }

    setTimeout(() => {
      at.events.forEach((fn) => {
        fn(at.value);
      });
    });

    if (!isSSR && storageKey) {
      if (option.saveStorage) {
        option.saveStorage(at.value);
      } else {
        const storage =
          option.storage === "sessionStorage" ? sessionStorage : localStorage;
        const str = JSON.stringify({ v: at.value });
        if (
          at.value === "" ||
          at.value === null ||
          at.value === void 0 ||
          str === defaultValueString
        ) {
          storage.removeItem(storageKey);
        } else {
          storage.setItem(storageKey, str);
        }
      }
    }
    for (const fn of eventAfters) {
      fn();
    }
  };

  if (storageKey) {
    at.loadStorage = () => {
      if (!storageKey || isSSR || storageLoaded) {
        return;
      }
      rended = true;
      storageLoaded = true;
      if (option.loadStorage) {
        option.loadStorage(storageKey).then((res) => {
          at.setValue(res);
        });
      } else {
        const storage =
          option.storage === "sessionStorage" ? sessionStorage : localStorage;
        const str = storage.getItem(storageKey);
        if (typeof str === "string") {
          try {
            const value = JSON.parse(str).v;
            at.setValue(value);
          } catch (err) {
            //
          }
        }
      }
    };
    if (rended) {
      at.loadStorage();
    }
  }

  return at as Atom<T>;
}

export function atom<T>(defaultValue: T, options?: AtomOptions) {
  return atomWithStorage("", defaultValue, options);
}

const EMPTY_ARRAY: any[] = [];

function useBeforeRender<T>(at: PrivateAtom<T>) {
  const [state, setState] = useState(at.value);
  useMemo(() => {
    at.events.add(setState);
  }, []);
  useEffect(() => {
    at.events.add(setState);
    at.loadStorage();
    return () => {
      at.events.delete(setState);
    };
  }, EMPTY_ARRAY);

  return [state, at.setValue] as const;
}

export function onStorageLoaded(fn: () => void) {
  const mount = () => {
    if (isSSR) {
      return;
    }
    if (!rended) {
      setTimeout(mount);
      return;
    }
    fn();
  };
  mount();
}

export function Block({ children }: { children: ReactNode }) {
  return useRef(children).current;
}

export function staticComponent<T>(fn: T): T {
  return (memo as any)(fn, () => false);
}
