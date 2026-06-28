// ===========================================================================
// MEDIA MODULE — the ONLY place IndexedDB is touched.
//
// Evidence blobs (photos / short videos) are far too big for localStorage, so
// they live in IndexedDB keyed by `media:<ladder>:<questId>:<criterionIdx>`.
// The state module stores only the idbKey reference (never the blob); the blob
// never leaves the device and is never part of the Phase 2 sync payload.
// ===========================================================================

const DB_NAME = 'fll-camp-media';
const DB_VERSION = 1;
const STORE = 'media';

/** Deterministic key so a re-capture (Retake) overwrites in place — no orphans. */
export function mediaKey(ladderId, questId, criterionIdx) {
  return `media:${ladderId}:${questId}:${criterionIdx}`;
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Store (or overwrite) a blob under `key`. Resolves with the key. */
export async function putMedia(key, blob) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(blob, key);
      tx.oncomplete = () => resolve(key);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/** Get a blob by key, or null if it isn't there. */
export async function getMedia(key) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

/** Delete a blob by key. Resolves whether or not it existed. */
export async function deleteMedia(key) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
