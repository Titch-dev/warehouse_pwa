export const resolveImageUrl = (image) => {
  if (!image) return null;

  const { type, value } = image;
  if (!value) return null;

  if (type === 'storage') {
    return `https://firebasestorage.googleapis.com/v0/b/${process.env.NEXT_PUBLIC_FIREBASE_BUCKET}/o/${encodeURIComponent(value)}?alt=media`;
  }

  if (type === 'external') {
    return value;
  }

  return null;
};