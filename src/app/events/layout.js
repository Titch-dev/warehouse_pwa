export const metadata = {
  title: 'Events | Westville Warehouse',
  description: 'See upcoming events at Westville Warehouse.',
  openGraph: {
    title: 'Events | Westville Warehouse',
    description: 'See upcoming events at Westville Warehouse.',
    images: [{ url: '/icons/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | Westville Warehouse',
    description: 'See upcoming events at Westville Warehouse.',
    images: ['/icons/og-default.jpg'],
  },
};

export default function EventsLayout({ children }) {
  return children;
}