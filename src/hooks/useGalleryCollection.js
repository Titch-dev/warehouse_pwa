'use client'

import { useMemo } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { warehouseDB } from '@/firebase/firebaseConfig';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';

export function useGalleryImages() {
  const galleryQuery = useMemo(() => {
    return query(
    collection(warehouseDB, 'gallery'),
    where('visible', '==', true),
    orderBy('order', 'asc')
  );
  }, []); 

  return useFirestoreCollection(galleryQuery, 'gallery');
}
