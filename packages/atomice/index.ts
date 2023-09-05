/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, memo, useEffect, useMemo, useRef, useState } from "react";
import { computedThrottle, setValueThrottle } from "./throttle";

const isSSR = typeof window === "undefined";

export interface Atom<T> {
  value: T;
  getDefaultValue: () => T;
  setState: React.Dispatch<React.SetStateAction<T>>;
  listen: (fn: (value: T) => void | Promise<void>) => void;
  Render: (props: {
    children?: (
      value: T,
      setValue: React.Dispatch<React.SetStateAction<T>>
    ) => any;
  }) => any;
  loadStorage: () => void;
}

interface PrivateAtom<T> extends Atom<T> {
  events: Set<React.Dispatch<React.SetStateAction<T>>>;
}

let rended = false;
export interface AtomOptions<T> {
  storageType?: "localStorage" | "sessionStorage";
  saveStorage?: (value: T) => void;
  loadStorage?: (key: string) => Promise<T>;
}

export function atomWithStorage<T>(
  storageKey: string,
  defaultValue: T,
  option: AtomOptions<T> = {}
) {
  const eventBefores: any = [];
  const defaultValueString = JSON.stringify({ v: defaultValue });
  let storageLoaded = false;
  const at = {
    value: defaultValue,
    events: new Set([]),
    setState: () => {},
    loadStorage: async () => {},
    getDefaultValue: () => JSON.parse(defaultValueString).v,
    listen: (fn) => {
      eventBefores.push(fn);
    },
    Render: ({ children }: { children: any }) => {
      return children(defaultValue);
    },
  } as PrivateAtom<T>;

  at.Render = staticComponent(({ children }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAtom(at);
    if (!children) {
      return at.value as ReactNode;
    }
    return children(at.value, at.setState);
  });

  at.setState = async (value: any) => {
    if (typeof value === "function") {
      value = value(at.value);
    }
    if (value === at.value) {
      return;
    }
    at.value = value;

    await Promise.all(
      eventBefores.map((fn: any) => Promise.resolve(fn(at.value)))
    );

    setTimeout(() => {
      setValueThrottle.throttle(() => {
        at.events.forEach((fn) => {
          fn(at.value);
        });
      });
    });

    if (!isSSR && storageKey) {
      if (option.saveStorage) {
        option.saveStorage(at.value);
      } else {
        const storage =
          option.storageType === "sessionStorage"
            ? sessionStorage
            : localStorage;
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
          at.setState(res);
        });
      } else {
        const storage =
          option.storageType === "sessionStorage"
            ? sessionStorage
            : localStorage;
        const str = storage.getItem(storageKey);
        if (typeof str === "string") {
          try {
            const value = JSON.parse(str).v;
            at.setState(value);
          } catch (err) {
            //
          }
        }
      }
    };
    if (storageKey) {
      if (rended) {
        at.loadStorage();
      } else {
        setTimeout(() => {
          at.loadStorage();
        }, 500);
      }
    }
  }

  return at as Atom<T>;
}

export function atom<T>(defaultValue: T) {
  return atomWithStorage("", defaultValue);
}

const EMPTY_ARRAY: any[] = [];

export function useAtom<T>(at: Atom<T>) {
  const [state, setState] = useState(at.value);
  useMemo(() => {
    (at as PrivateAtom<T>).events.add(setState);
  }, []);
  useEffect(() => {
    (at as PrivateAtom<T>).events.add(setState);
    at.loadStorage();
    return () => {
      (at as PrivateAtom<T>).events.delete(setState);
    };
  }, EMPTY_ARRAY);

  return [state, setState] as const;
}

export function useAtomValue<T>(at: Atom<T>) {
  const [state] = useAtom(at);
  return state;
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

export function onMount(fn: () => void) {
  if (isSSR) {
    return;
  }
  const checker = () => {
    if (rended) {
      fn();
    } else {
      setTimeout(checker, 50);
    }
  };
  checker();
}

export function atomWithComputed<T>(fn: () => T, depend: Atom<any>[]): Atom<T> {
  const target = atom(fn());
  depend.forEach((v) => {
    v.listen(() => {
      computedThrottle.throttle(() => {
        target.setState(fn());
      });
    });
  });
  return target;
}
