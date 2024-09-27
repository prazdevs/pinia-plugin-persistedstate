import type { PublicRuntimeConfig } from '@nuxt/schema'
import type { StorageLike } from '../types'
import { useCookie } from '#app'

type CookiesStorageOptions = PublicRuntimeConfig['piniaPluginPersistedstate']['cookieOptions']

/**
 * Cookie-based storage. Cookie options can be passed as parameter.
 * Uses Nuxt's `useCookie` under the hood.
 */
function cookies(options: CookiesStorageOptions = {}): StorageLike {
  return {
    getItem: key => useCookie<string | null>(
      key,
      {
        ...options,
        decode: decodeURIComponent,
        readonly: true,
      },
    ).value,
    setItem: (key, value) => useCookie<string>(
      key,
      {
        ...options,
        encode: encodeURIComponent,
      },
    ).value = value,
  }
}

/**
 * LocalStorage-based storage.
 * Warning: only works client-side.
 */
function localStorage(): StorageLike {
  return {
    getItem: key => import.meta.client
      ? window.localStorage.getItem(key)
      : null,
    setItem: (key, value) => import.meta.client
      ? window.localStorage.setItem(key, value)
      : null,
  }
}

/**
 * SessionStorage-based storage.
 * Warning: only works client-side.
 */
function sessionStorage(): StorageLike {
  return {
    getItem: key => import.meta.client
      ? window.sessionStorage.getItem(key)
      : null,
    setItem: (key, value) => import.meta.client
      ? window.sessionStorage.setItem(key, value)
      : null,
  }
}

/**
 * IndexedDB-based storage.
 * Warning: only works client-side.
 */
import { openDB } from 'idb';
const DB_NAME = 'piniapersisted';
const STORE_NAME = 'piniapersisted';
const VERSION = 1;

// Get and/or create the database
async function initDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

function indexedDBStorage() {
  return {
    getItem: async (key) => {
      if (import.meta.client) {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const result = await store.get(key);
        await tx.done;
        return result || null;
      }
      return null;
    },
    setItem: async (key, value) => {
      if (import.meta.client) {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.put(value, key);
        await tx.done;
      }
    },
  };
}

export const storages = {
  cookies,
  localStorage,
  sessionStorage,
  indexedDBStorage,
}
