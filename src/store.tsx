import { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { initialData, nextId } from "./data";
import type { DemoState } from "./data";
import { migrateDemoState } from "./careData";
import type { LocalPhoto, PhotoRecord } from "./careData";
const KEY = "fastcare-demo-v1";
const LEGACY_KEY = "appliancecare-demo-v1";
type Store = {
  data: DemoState;
  update: (fn: (d: DemoState) => DemoState) => void;
  reset: () => void;
  toast: (s: string) => void;
  message: string;
  localPhotos: LocalPhoto[];
  addLocalPhoto: (file: File, info: Omit<PhotoRecord, "id" | "sample">) => void;
};
const Context = createContext<Store>(null!);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoState>(() => {
    try {
      const saved =
        localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
      return saved
        ? migrateDemoState(JSON.parse(saved), initialData)
        : structuredClone(initialData);
    } catch {
      return structuredClone(initialData);
    }
  });
  const [message, setMessage] = useState("");
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const photoUrls = useRef(new Set<string>());
  useEffect(
    () => () => {
      photoUrls.current.forEach((url) => URL.revokeObjectURL(url));
      photoUrls.current.clear();
    },
    [],
  );
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      localStorage.removeItem(LEGACY_KEY);
    } catch {}
  }, [data]);
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);
  return (
    <Context.Provider
      value={{
        data,
        update: (fn) => setData(fn),
        reset: () => {
          photoUrls.current.forEach((url) => URL.revokeObjectURL(url));
          photoUrls.current.clear();
          setLocalPhotos([]);
          for (const key of Object.keys(sessionStorage)) {
            if (key.startsWith("photo-") || key.startsWith("case-photos-"))
              sessionStorage.removeItem(key);
          }
          setData(structuredClone(initialData));
          setMessage("Demo data reset");
        },
        toast: setMessage,
        message,
        localPhotos,
        addLocalPhoto: (file, info) => {
          const url = URL.createObjectURL(file);
          photoUrls.current.add(url);
          setLocalPhotos((photos) => [
            ...photos,
            { ...info, id: nextId("photo"), sample: false, url },
          ]);
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
