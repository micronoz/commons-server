export const __prod__ = process.env.NODE_ENV === 'production';
export const __dbhost__ = process.env.DATABASE_HOST;
export const __firebaseKey__ =
  process.env.NODE_ENV === 'production'
    ? JSON.parse(process.env.FIREBASE_KEY!)
    : '';
