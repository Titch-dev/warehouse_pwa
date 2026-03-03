import 'server-only';
import { cache } from 'react';
import { getFirestore } from './firebaseAdmin';

/**
 * Normalise event shape so metadata code can safely use:
 * event?.image?.value
 */
function normaliseEvent(id, data) {
  const image =
    typeof data?.image === 'string'
      ? { value: data.image }
      : data?.image && typeof data.image === 'object'
        ? data.image
        : null;

  return {
    id,
    ...data,
    image,
  };
}

/**
 * Server-side lookup by slug.
 * - Queries Firestore by `slug` field
 * - Falls back to doc ID lookup
 * - Returns null if not found or error
 *
 * Wrapped in React cache() so multiple calls in one request
 * don't re-hit Firestore.
 */
export const getEventBySlug = cache(async (slug) => {
  if (!slug || typeof slug !== 'string') return null;

  const db = getFirestore();

  try {
    // 1) Query by slug field
    const snap = await db
      .collection('events')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (!snap.empty) {
      const doc = snap.docs[0];
      return normaliseEvent(doc.id, doc.data());
    }

    // 2) Fallback: slug used as doc ID
    const byId = await db.collection('events').doc(slug).get();

    if (byId.exists) {
      return normaliseEvent(byId.id, byId.data());
    }

    return null;
  } catch (err) {
    console.error('[getEventBySlug] Firestore error:', err);
    return null;
  }
});