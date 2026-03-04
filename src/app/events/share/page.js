import { Suspense } from 'react';
import ShareRedirectClient from './share-redirect-client';

export default function EventsSharePage() {
  return (
    <Suspense fallback={null}>
      <ShareRedirectClient />
    </Suspense>
  );
}