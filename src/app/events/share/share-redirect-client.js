'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ShareRedirectClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const slug = params.get('slug');

    if (!slug) {
      router.replace('/events', { scroll: false });
      return;
    }

    router.replace(`/events?event=${encodeURIComponent(slug)}`, { scroll: false });
  }, [params, router]);

  return null;
}