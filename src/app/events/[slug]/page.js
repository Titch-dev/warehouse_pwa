import { redirect, notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/server/events';

/**
 * Generate SEO metadata
 */
export async function generateMetadata({ params }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://thewestvillewarehouse.co.za';

  const event = await getEventBySlug(params.slug);

  // If event doesn't exist, return minimal metadata
  // (Next will still render 404 from page() below)
  if (!event) {
    return {
      title: 'Event Not Found | Westville Warehouse',
      description: 'This event could not be found.',
    };
  }

  const title = `${event.name} | Westville Warehouse`;
  const description =
    event?.description?.slice(0, 160) ||
    'See upcoming events at Westville Warehouse.';

  const image =
    event?.image?.value ||
    `${siteUrl}/icons/og-default.jpg`;

  const url = `${siteUrl}/events/${params.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Slug page
 * - Valid slug → redirect to main events page with query param
 * - Invalid slug → proper 404
 */
export default async function EventSlugPage({ params }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound(); // Returns 404 status + renders app/not-found.js if you have one
  }

  redirect(`/events?event=${encodeURIComponent(params.slug)}`);
}