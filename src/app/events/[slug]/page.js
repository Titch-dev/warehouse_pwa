// app/events/[slug]/page.js  (your EventSlugPage)
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const title = `Event | Westville Warehouse`;
  const description = 'See upcoming events at Westville Warehouse.';

  // 🚨 replace localhost with your real domain in production
  // currently set to localhost!!!!!!!
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://westvillewarehouse.co.za';

  // Use a PUBLIC absolute URL (must be accessible to WhatsApp/Twitter bots)
  const image = `${siteUrl}/icons/og-default.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/events/${params.slug}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function EventSlugPage({ params }) {
  // ✅ Humans get redirected to the smooth UX URL
  redirect(`/events?event=${encodeURIComponent(params.slug)}`);
}