'use client'

import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { warehouseDB } from '@/firebase/firebaseConfig'

export function useFirestoreCollection(rootCollection) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const rootRef = collection(warehouseDB, rootCollection)
      const snapshot = await getDocs(rootRef)

      const allDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setData(allDocs)
    } catch (err) {
      console.error('Error fetching Firestore data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [rootCollection])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}