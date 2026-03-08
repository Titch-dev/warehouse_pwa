import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Access denied</h1>
      <p>You do not have permission to view this page.</p>
      <p>
        <Link href="/dashboard">Go to dashboard</Link>
      </p>
    </main>
  );
}