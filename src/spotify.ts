import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const API = "https://api.spotify.com/v1";
const ACCOUNTS = "https://accounts.spotify.com";

const TOKEN_KEY = "workout-roulette-spotify-token";
const CLIENT_ID_KEY = "workout-roulette-spotify-client-id";
const SELECTION_KEY = "workout-roulette-spotify-selection";
const VERIFIER_KEY = "workout-roulette-spotify-verifier";
const STATE_KEY = "workout-roulette-spotify-state";

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
];

export type SpotifyStatus =
  | "unconfigured"
  | "disconnected"
  | "connecting"
  | "connected";

export type SpotifyError =
  | "auth"
  | "premium"
  | "playback"
  | "network"
  | "noDevice"
  | "notConfigured"
  | null;

export type SpotifyItemKind = "track" | "playlist";

export interface SpotifyItem {
  uri: string;
  kind: SpotifyItemKind;
  name: string;
  subtitle: string;
  image: string | null;
}

export interface SpotifyProfile {
  id: string;
  name: string;
  image: string | null;
  product: string | null;
}

export interface SpotifyPlayback {
  paused: boolean;
  name: string;
  artists: string;
  image: string | null;
}

interface SpotifyToken {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

interface SpotifyImage {
  url: string;
}

interface SpotifyTrack {
  uri: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: SpotifyImage[] };
}

interface SpotifyPlaylist {
  uri: string;
  name: string;
  owner?: { display_name?: string };
  images?: SpotifyImage[];
}

interface SpotifySearchResponse {
  tracks?: { items?: (SpotifyTrack | null)[] };
  playlists?: { items?: (SpotifyPlaylist | null)[] };
}

interface SpotifyMe {
  id: string;
  display_name?: string;
  product?: string;
  images?: SpotifyImage[];
}

interface SpotifySdkState {
  paused: boolean;
  track_window?: {
    current_track?: {
      name?: string;
      artists?: { name: string }[];
      album?: { images?: SpotifyImage[] };
    };
  };
}

interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
}

interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, callback: (payload: unknown) => void): boolean;
  removeListener(event: string, callback?: (payload: unknown) => void): boolean;
  togglePlay(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
  setVolume(volume: number): Promise<void>;
}

declare global {
  interface Window {
    Spotify?: { Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0.6;
  return Math.min(1, Math.max(0, value));
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return base64Url(new Uint8Array(digest));
}

/** The exact URI that must be registered in the Spotify developer dashboard. */
export function getSpotifyRedirectUri(): string {
  if (typeof window === "undefined") return "";
  const { origin, pathname } = window.location;
  const cleanPath = pathname.replace(/index\.html?$/i, "");
  return `${origin}${cleanPath || "/"}`;
}

export function getStoredClientId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(CLIENT_ID_KEY)?.trim();
    if (stored) return stored;
  } catch {
    // storage may be unavailable
  }
  return (import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? "").trim();
}

function readToken(): SpotifyToken | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpotifyToken>;
    if (
      typeof parsed.access_token !== "string" ||
      typeof parsed.expires_at !== "number"
    ) {
      return null;
    }
    return {
      access_token: parsed.access_token,
      refresh_token:
        typeof parsed.refresh_token === "string"
          ? parsed.refresh_token
          : undefined,
      expires_at: parsed.expires_at,
    };
  } catch {
    return null;
  }
}

function readSelection(): SpotifyItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpotifyItem>;
    if (
      typeof parsed.uri !== "string" ||
      (parsed.kind !== "track" && parsed.kind !== "playlist") ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }
    return {
      uri: parsed.uri,
      kind: parsed.kind,
      name: parsed.name,
      subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : "",
      image: typeof parsed.image === "string" ? parsed.image : null,
    };
  } catch {
    return null;
  }
}

function cleanCallbackUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    url.searchParams.delete("error");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  } catch {
    // ignore
  }
}

function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // storage may be unavailable
  }
}

function removeSession(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // storage may be unavailable
  }
}

async function requestToken(body: URLSearchParams): Promise<SpotifyToken> {
  const response = await fetch(`${ACCOUNTS}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error(`token-${response.status}`);
  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
}

async function exchangeCode(
  code: string,
  verifier: string,
  clientId: string,
): Promise<SpotifyToken> {
  return requestToken(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: getSpotifyRedirectUri(),
      client_id: clientId,
      code_verifier: verifier,
    }),
  );
}

async function refreshAccessToken(
  token: SpotifyToken,
  clientId: string,
): Promise<SpotifyToken> {
  if (!token.refresh_token) throw new Error("no-refresh-token");
  const next = await requestToken(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_id: clientId,
    }),
  );
  return {
    ...next,
    refresh_token: next.refresh_token ?? token.refresh_token,
  };
}

async function apiGet<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) throw new Error(`spotify-${response.status}`);
  return (await response.json()) as T;
}

let sdkPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no-window"));
  if (window.Spotify) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-spotify-sdk]",
    );
    window.onSpotifyWebPlaybackSDKReady = () => resolve();

    if (existing) {
      if (window.Spotify) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.dataset.spotifySdk = "true";
    script.onerror = () => reject(new Error("sdk-load"));
    document.body.appendChild(script);
  });

  return sdkPromise;
}

function mapPlayback(state: SpotifySdkState): SpotifyPlayback {
  const track = state.track_window?.current_track;
  return {
    paused: Boolean(state.paused),
    name: track?.name ?? "",
    artists: (track?.artists ?? []).map((artist) => artist.name).join(", "),
    image: track?.album?.images?.[0]?.url ?? null,
  };
}

function mapSearchResults(data: SpotifySearchResponse): SpotifyItem[] {
  const tracks = (data.tracks?.items ?? [])
    .filter((track): track is SpotifyTrack => Boolean(track))
    .map<SpotifyItem>((track) => ({
      uri: track.uri,
      kind: "track",
      name: track.name,
      subtitle: track.artists.map((artist) => artist.name).join(", "),
      image: track.album?.images?.[0]?.url ?? null,
    }));

  const playlists = (data.playlists?.items ?? [])
    .filter((playlist): playlist is SpotifyPlaylist => Boolean(playlist))
    .map<SpotifyItem>((playlist) => ({
      uri: playlist.uri,
      kind: "playlist",
      name: playlist.name,
      subtitle: playlist.owner?.display_name ?? "",
      image: playlist.images?.[0]?.url ?? null,
    }));

  return [...tracks, ...playlists];
}

export function useSpotify(enabled: boolean, volume: number) {
  const [clientId, setClientId] = useState(getStoredClientId);
  const [token, setToken] = useState<SpotifyToken | null>(readToken);
  const [status, setStatus] = useState<SpotifyStatus>(() => {
    if (!getStoredClientId()) return "unconfigured";
    return readToken() ? "connected" : "disconnected";
  });
  const [profile, setProfile] = useState<SpotifyProfile | null>(null);
  const [selection, setSelection] = useState<SpotifyItem | null>(readSelection);
  const [playback, setPlayback] = useState<SpotifyPlayback | null>(null);
  const [error, setError] = useState<SpotifyError>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const tokenRef = useRef<SpotifyToken | null>(token);
  const playerRef = useRef<SpotifyPlayer | null>(null);
  const deviceIdRef = useRef<string | null>(null);
  const volumeRef = useRef(clamp01(volume));
  const lastPlayedRef = useRef<string | null>(null);
  volumeRef.current = clamp01(volume);

  const storeToken = useCallback((next: SpotifyToken | null) => {
    tokenRef.current = next;
    setToken(next);
    try {
      if (next) {
        window.localStorage.setItem(TOKEN_KEY, JSON.stringify(next));
      } else {
        window.localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // storage may be unavailable — the session still works
    }
  }, []);

  const ensureToken = useCallback(async (): Promise<SpotifyToken | null> => {
    const current = tokenRef.current;
    if (!current) return null;
    if (current.expires_at - 60_000 > Date.now()) return current;

    const id = getStoredClientId();
    if (!id || !current.refresh_token) {
      storeToken(null);
      return null;
    }

    try {
      const next = await refreshAccessToken(current, id);
      storeToken(next);
      return next;
    } catch {
      storeToken(null);
      setStatus("disconnected");
      setError("auth");
      return null;
    }
  }, [storeToken]);

  // Complete the PKCE callback exactly once per redirect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const authError = params.get("error");
    if (!code && !authError) return;

    const state = params.get("state");
    const expectedState = readSession(STATE_KEY);
    const verifier = readSession(VERIFIER_KEY);
    cleanCallbackUrl();

    if (authError) {
      setError("auth");
      setStatus(getStoredClientId() ? "disconnected" : "unconfigured");
      return;
    }

    const id = getStoredClientId();
    if (!id || !verifier || !state || state !== expectedState) {
      setError("auth");
      setStatus(id ? "disconnected" : "unconfigured");
      return;
    }

    removeSession(STATE_KEY);
    removeSession(VERIFIER_KEY);
    setStatus("connecting");

    exchangeCode(code ?? "", verifier, id)
      .then((next) => {
        storeToken(next);
        setStatus("connected");
        setError(null);
      })
      .catch(() => {
        setStatus("disconnected");
        setError("auth");
      });
  }, [storeToken]);

  // Profile is optional — it only personalises the settings card.
  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }

    let active = true;
    void (async () => {
      const fresh = await ensureToken();
      if (!fresh) return;
      try {
        const me = await apiGet<SpotifyMe>("/me", fresh.access_token);
        if (!active) return;
        setProfile({
          id: me.id,
          name: me.display_name?.trim() || me.id,
          image: me.images?.[0]?.url ?? null,
          product: me.product ?? null,
        });
      } catch {
        // keep the UI usable even if the profile request fails
      }
    })();

    return () => {
      active = false;
    };
  }, [token, ensureToken]);

  // Load and connect the Web Playback SDK only while Spotify is the active source.
  const hasToken = Boolean(token);
  useEffect(() => {
    if (!enabled || !hasToken) return;

    let cancelled = false;
    let player: SpotifyPlayer | null = null;
    setInitializing(true);

    loadSdk()
      .then(() => {
        if (cancelled || !window.Spotify) return;

        player = new window.Spotify.Player({
          name: "Workout Roulette",
          getOAuthToken: (callback) => {
            void ensureToken().then((fresh) => {
              if (fresh) callback(fresh.access_token);
            });
          },
          volume: volumeRef.current,
        });
        playerRef.current = player;

        player.addListener("ready", (payload) => {
          if (cancelled) return;
          const data = payload as { device_id?: string };
          deviceIdRef.current = data.device_id ?? null;
          setSdkReady(true);
          setInitializing(false);
          setError(null);
          void player?.setVolume(volumeRef.current).catch(() => {});
        });

        player.addListener("not_ready", () => {
          if (cancelled) return;
          deviceIdRef.current = null;
          setSdkReady(false);
        });

        player.addListener("player_state_changed", (payload) => {
          if (cancelled) return;
          setPlayback(payload ? mapPlayback(payload as SpotifySdkState) : null);
        });

        player.addListener("account_error", () => {
          if (!cancelled) setError("premium");
        });
        player.addListener("authentication_error", () => {
          if (!cancelled) setError("auth");
        });
        player.addListener("playback_error", () => {
          if (!cancelled) setError("playback");
        });
        player.addListener("initialization_error", () => {
          if (!cancelled) setError("playback");
        });

        void player.connect().then((connected) => {
          if (cancelled) return;
          if (!connected) {
            setInitializing(false);
            setError("playback");
          }
        });
      })
      .catch(() => {
        if (!cancelled) {
          setInitializing(false);
          setError("playback");
        }
      });

    return () => {
      cancelled = true;
      setSdkReady(false);
      setInitializing(false);
      deviceIdRef.current = null;
      try {
        player?.disconnect();
      } catch {
        // ignore
      }
      playerRef.current = null;
      setPlayback(null);
    };
  }, [enabled, hasToken, ensureToken]);

  const playItem = useCallback(
    async (item: SpotifyItem) => {
      const fresh = await ensureToken();
      if (!fresh) {
        setError("auth");
        return;
      }
      const deviceId = deviceIdRef.current;
      if (!deviceId) {
        setError("noDevice");
        return;
      }

      try {
        await fetch(`${API}/me/player`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${fresh.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [deviceId], play: false }),
        });

        const body =
          item.kind === "track"
            ? { uris: [item.uri] }
            : { context_uri: item.uri };
        const response = await fetch(
          `${API}/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${fresh.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );
        if (!response.ok) throw new Error(`play-${response.status}`);
        setError(null);
      } catch {
        setError("playback");
      }
    },
    [ensureToken],
  );

  // Resume the saved selection when Spotify becomes active or the player is ready.
  useEffect(() => {
    if (!enabled) return;
    if (!sdkReady || !selection) return;
    if (lastPlayedRef.current === selection.uri) return;
    lastPlayedRef.current = selection.uri;
    void playItem(selection);
  }, [enabled, sdkReady, selection, playItem]);

  // Pause as soon as the user switches to another music source or turns music off.
  useEffect(() => {
    if (enabled) return;
    lastPlayedRef.current = null;
    void playerRef.current?.pause().catch(() => {});
  }, [enabled]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    void player.setVolume(clamp01(volume)).catch(() => {});
  }, [volume, sdkReady]);

  const search = useCallback(
    async (query: string): Promise<SpotifyItem[]> => {
      const trimmed = query.trim();
      if (!trimmed) return [];

      const fresh = await ensureToken();
      if (!fresh) {
        setError("auth");
        return [];
      }

      const params = new URLSearchParams({
        q: trimmed,
        type: "track,playlist",
        limit: "8",
      });

      try {
        const data = await apiGet<SpotifySearchResponse>(
          `/search?${params.toString()}`,
          fresh.access_token,
        );
        return mapSearchResults(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        if (message.includes("401")) {
          storeToken(null);
          setStatus("disconnected");
          setError("auth");
        } else {
          setError("network");
        }
        return [];
      }
    },
    [ensureToken, storeToken],
  );

  const select = useCallback(
    (item: SpotifyItem) => {
      setSelection(item);
      try {
        window.localStorage.setItem(SELECTION_KEY, JSON.stringify(item));
      } catch {
        // storage may be unavailable
      }

      if (selection?.uri === item.uri && enabled && sdkReady) {
        void playItem(item);
      }
    },
    [selection, enabled, sdkReady, playItem],
  );

  const toggle = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.togglePlay();
    } catch {
      setError("playback");
    }
  }, []);

  const next = useCallback(async () => {
    try {
      await playerRef.current?.nextTrack();
    } catch {
      setError("playback");
    }
  }, []);

  const previous = useCallback(async () => {
    try {
      await playerRef.current?.previousTrack();
    } catch {
      setError("playback");
    }
  }, []);

  const login = useCallback(async () => {
    const id = getStoredClientId();
    if (!id) {
      setError("notConfigured");
      setStatus("unconfigured");
      return;
    }

    try {
      const verifier = base64Url(randomBytes(48));
      const state = base64Url(randomBytes(16));
      writeSession(VERIFIER_KEY, verifier);
      writeSession(STATE_KEY, state);

      const challenge = await sha256(verifier);
      const params = new URLSearchParams({
        client_id: id,
        response_type: "code",
        redirect_uri: getSpotifyRedirectUri(),
        code_challenge_method: "S256",
        code_challenge: challenge,
        state,
        scope: SCOPES.join(" "),
      });

      window.location.assign(`${ACCOUNTS}/authorize?${params.toString()}`);
    } catch {
      setError("auth");
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      playerRef.current?.disconnect();
    } catch {
      // ignore
    }
    playerRef.current = null;
    deviceIdRef.current = null;
    setSdkReady(false);
    setPlayback(null);
    setProfile(null);
    storeToken(null);
    setError(null);
    setStatus(getStoredClientId() ? "disconnected" : "unconfigured");
  }, [storeToken]);

  const saveClientId = useCallback((value: string) => {
    const trimmed = value.trim();
    try {
      if (trimmed) {
        window.localStorage.setItem(CLIENT_ID_KEY, trimmed);
      } else {
        window.localStorage.removeItem(CLIENT_ID_KEY);
      }
    } catch {
      // storage may be unavailable
    }
    setClientId(trimmed);
    setError(null);
    setStatus(
      tokenRef.current ? "connected" : trimmed ? "disconnected" : "unconfigured",
    );
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return useMemo(
    () => ({
      clientId,
      redirectUri: getSpotifyRedirectUri(),
      status,
      error,
      profile,
      playback,
      sdkReady,
      initializing,
      hasSelection: Boolean(selection),
      login,
      logout: disconnect,
      saveClientId,
      search,
      select,
      toggle,
      next,
      previous,
      clearError,
    }),
    [
      clientId,
      status,
      error,
      profile,
      playback,
      sdkReady,
      initializing,
      selection,
      login,
      disconnect,
      saveClientId,
      search,
      select,
      toggle,
      next,
      previous,
      clearError,
    ],
  );
}

export type SpotifyController = ReturnType<typeof useSpotify>;
