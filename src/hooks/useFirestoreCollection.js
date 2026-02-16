'use client'

import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { warehouseDB } from '@/firebase/firebaseConfig'

/* ---------- Local Cache Helpers ---------- */


function getLocalCache(key) {
  if (typeof window === 'undefined') return null

  const item = localStorage.getItem(key)
  if (!item) return null

  try {
    return JSON.parse(item)
  } catch {
    return null
  }
}

function setLocalCache(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

/* ---------- Main Hook ---------- */

export function useFirestoreCollection(collectionOrQuery, versionKey) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      /* Read metadata version */
      const metaRef = doc(warehouseDB, 'metadata', 'collections')
      const metaSnap = await getDoc(metaRef);
      
      if (!metaSnap.exists()) {
        throw new Error('Metadata document missing')
      }

      const serverVersion = 
        metaSnap.data()?.[versionKey]?.toMillis?.() 
        ?? metaSnap.data()?.[versionKey]

      if (serverVersion == null) {
        throw new Error(`Version key "${versionKey}" not found in metadata`)
      }

      /* Check local cache */
      const cached = getLocalCache(versionKey)

      if (cached && cached.version === serverVersion) {
        setData(cached.data)
        setLoading(false)
        return
      }

      /* Fetch collection */
      const ref =
        typeof collectionOrQuery === 'string'
          ? collection(warehouseDB, collectionOrQuery)
          : collectionOrQuery

      const snapshot = await getDocs(ref)

      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      /* Save to local cache */
      setLocalCache(versionKey, {
        version: serverVersion,
        data: allDocs
      })

        setData(allDocs)

      } catch (err) {
        console.error('Error fetching Firestore data:', err)
        setError(err?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
      }, [collectionOrQuery, versionKey])

      useEffect(() => {
        fetchData()
      }, [fetchData])

      return { data, loading, error, refetch: fetchData }
    }