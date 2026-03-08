"use client";

import { useCurrentUserDoc } from "@/hooks/useCurrentUserDoc";

export default function ProfilePage() {
  const { authUser, userDoc, loading, error } = useCurrentUserDoc();

  if (loading) {
    return <main><p>Loading profile...</p></main>;
  }

  if (!authUser) {
    return (
      <main>
        <h1>Profile</h1>
        <p>You need to sign in to view this page.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Profile</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!userDoc) {
    return (
      <main>
        <h1>Profile</h1>
        <p>Profile data could not be found.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Profile</h1>

      <p><strong>Name:</strong> {userDoc.displayName || "Not set"}</p>
      <p><strong>Email:</strong> {userDoc.email || "Not set"}</p>
      <p><strong>Role:</strong> {userDoc.role}</p>
      <p><strong>Status:</strong> {userDoc.status}</p>
      <p>
        <strong>Membership active:</strong>{" "}
        {userDoc.membership?.isActive ? "Yes" : "No"}
      </p>
      <p>
        <strong>Membership expiry:</strong>{" "}
        {userDoc.membership?.expiry?.toDate
          ? userDoc.membership.expiry.toDate().toLocaleDateString()
          : "None"}
      </p>
    </main>
  );
}