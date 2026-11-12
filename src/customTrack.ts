import { useCallback, useEffect, useMemo, useState } from "react";

export type CustomTrackError =
  | "tooLarge"
  | "unsupported"
  | "tooMany"
  | "failed";

export interface CustomTrackMeta {
  id: string;
  name: string;
  size: number;
  updatedAt: number;
}

interface StoredTrack extends CustomTrackMeta {
  blob: Blob;
  type: string;
}

const DB_NAME = "workout-roulette-media";
const DB_VERSION = 1;
const STORE_NAME = "tracks";
/** Key used by the first version of the feature (single uploaded track). */
const LEGACY_KEY = "custom-music";

/** Uploaded tracks live in IndexedDB, so they survive reloads without a server. */
export const MAX_TRACK_BYTES = 30 * 1024 * 1024;
export const MAX_TRACKS = 10;

const AUDIO_EXTENSION = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|weba|webm)$/i;

function isAudioFile(file: File): boolean {
  return file.type.startsWith("audio/") || AUDIO_EXTENSION.test(file.name);
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexeddb-unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("indexeddb-error"));
  });
}

function withStore<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const request = run(tx.objectStore(STORE_NAME));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
          reject(request.error ?? new Error("indexeddb-error"));
        tx.oncomplete = () => db.close();
        tx.onabort = () => db.close();
      }),
  );
}

function createId(): string {
  return `track-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readAllTracks(): Promise<StoredTrack[]> {
  const raw = await withStore<unknown[]>(
    "readonly",
    (store) => store.getAll() as IDBRequest<unknown[]>,
  );

  const tracks: StoredTrack[] = [];
  let legacy: (Omit<StoredTrack, "id"> & { blob: Blob }) | null = null;

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Partial<StoredTrack> & { blob?: Blob };
    if (!(candidate.blob instanceof Blob)) continue;

    if (typeof candidate.id === "string") {
      tracks.push(candidate as StoredTrack);
    } else if (typeof candidate.name === "string" && !legacy) {
      // First release stored a single record without an id — migrate it.
      legacy = candidate as Omit<StoredTrack, "id"> & { blob: Blob };
    }
  }

  if (legacy) {
    const migrated: StoredTrack = {
      // Deterministic id keeps the migration idempotent when React
      // mounts the effect twice in development.
      id: "legacy-track",
      name: legacy.name,
      size: legacy.size,
      updatedAt: legacy.updatedAt ?? Date.now(),
      blob: legacy.blob,
      type: legacy.type ?? legacy.blob.type ?? "audio/mpeg",
    };
    await withStore("readwrite", (store) => store.put(migrated, migrated.id));
    await withStore("readwrite", (store) => store.delete(LEGACY_KEY));
    tracks.push(migrated);
  }

  return tracks.sort((a, b) => a.updatedAt - b.updatedAt);
}

/**
 * Keeps the user's uploaded playlist in sync with IndexedDB and exposes a
 * short-lived object URL for the active track.
 */
export function useCustomTrack(activeId: string | null) {
  const [tracks, setTracks] = useState<StoredTrack[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<CustomTrackError | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    readAllTracks()
      .then((stored) => {
        if (active) setTracks(stored);
      })
      .catch(() => {
        // IndexedDB is unavailable (private mode etc.) — uploads are disabled
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const active = useMemo(() => {
    if (tracks.length === 0) return null;
    return (
      tracks.find((track) => track.id === activeId) ??
      tracks[tracks.length - 1] ??
      null
    );
  }, [tracks, activeId]);

  useEffect(() => {
    if (!active) {
      setUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(active.blob);
    setUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [active]);

  const add = useCallback(
    async (file: File): Promise<string | null> => {
      setError(null);

      if (!isAudioFile(file)) {
        setError("unsupported");
        return null;
      }
      if (file.size > MAX_TRACK_BYTES) {
        setError("tooLarge");
        return null;
      }
      if (tracks.length >= MAX_TRACKS) {
        setError("tooMany");
        return null;
      }

      setBusy(true);
      try {
        const track: StoredTrack = {
          id: createId(),
          name: file.name,
          size: file.size,
          updatedAt: Date.now(),
          blob: file,
          type: file.type || "audio/mpeg",
        };
        await withStore("readwrite", (store) =>
          store.put(track, track.id),
        );
        setTracks((current) => [...current, track]);
        return track.id;
      } catch {
        setError("failed");
        return null;
      } finally {
        setBusy(false);
      }
    },
    [tracks.length],
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    setError(null);
    setBusy(true);
    try {
      await withStore("readwrite", (store) => store.delete(id));
      setTracks((current) => current.filter((track) => track.id !== id));
    } catch {
      setError("failed");
    } finally {
      setBusy(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const meta = useMemo<CustomTrackMeta[]>(
    () =>
      tracks.map((track) => ({
        id: track.id,
        name: track.name,
        size: track.size,
        updatedAt: track.updatedAt,
      })),
    [tracks],
  );

  return {
    tracks: meta,
    active,
    activeId: active?.id ?? null,
    url,
    ready,
    busy,
    error,
    add,
    remove,
    clearError,
  };
}
