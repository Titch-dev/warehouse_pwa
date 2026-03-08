# Firebase Security Rules

## Purpose

This document describes the baseline Firestore and Storage security model for Phase 2 of the Westville Warehouse PWA.

Goals:

- Public users can read website content
- Customers can access only their own profile data
- Staff can perform operational reads where needed
- Admin and owner roles control CMS content
- Customers cannot escalate privileges through client-side writes
- Sensitive operational paths, including sessions, are protected

---

## Firestore Access Model

### Public read collections
The following collections are publicly readable:

- `events`
- `menu`
- `specials`
- `gallery`

These collections power public website content.

### User documents
Path:

- `users/{uid}`

Rules:

- A signed-in user may read their own user document
- `staff`, `admin`, and `owner` may read user documents for operational workflows
- A user may create their own document only during signup
- A user may update only safe profile fields
- A user may not change:
  - `uid`
  - `role`
  - `status`
  - `membership`

### CMS writes
Writes to public content collections are restricted to:

- `admin`
- `owner`

### Sessions
Session write paths are currently function-only.

This prevents clients from forging session state, membership validity, or timing data.

---

## Storage Access Model

Public read is allowed for published content assets such as:

- gallery images
- event images
- menu images
- specials images

Uploads/writes are restricted to:

- `admin`
- `owner`

---

## Deployment

From the project root:

```bash
firebase deploy --only firestore:rules,storage