import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request
        ? input.headers
        : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);

    return fetch(input, { ...init, headers });
  };
}

function getEnv(key: string): string | undefined {
  const viteValue = import.meta.env[key];

  if (viteValue) return viteValue;

  if (typeof process !== "undefined") {
    return process.env[key];
  }

  return undefined;
}

function createSupabaseClient() {
  const supabaseUrl = getEnv("VITE_SUPABASE_URL") || getEnv("SUPABASE_URL");

  const supabaseKey =
    getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
    getEnv("VITE_SUPABASE_ANON_KEY") ||
    getEnv("SUPABASE_PUBLISHABLE_KEY") ||
    getEnv("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    const missing = [
      !supabaseUrl ? "VITE_SUPABASE_URL" : null,
      !supabaseKey ? "VITE_SUPABASE_PUBLISHABLE_KEY" : null,
    ].filter(Boolean);

    throw new Error(
      `[Supabase] Variáveis de ambiente ausentes: ${missing.join(
        ", ",
      )}. Configure o arquivo .env com os dados do projeto Supabase da Nova Nexo.`,
    );
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      fetch: createSupabaseFetch(supabaseKey),
    },
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let supabaseInstance: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient();
    }

    return Reflect.get(supabaseInstance, prop, receiver);
  },
});