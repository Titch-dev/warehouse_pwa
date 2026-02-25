import { useEffect, useState } from 'react';
import { resolveImageUrl } from '@/lib/utils';

export function useResolvedImage(image) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!image) {
      setSrc(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function resolve() {
      setLoading(true);
      const url = await resolveImageUrl(image);

      if (isMounted) {
        setSrc(url);
        setLoading(false);
      }
    }

    resolve();

    return () => {
      isMounted = false;
    };
  }, [image]);

  return { src, loading };
}
