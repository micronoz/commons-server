export const __prod__ = process.env.NODE_ENV === 'production';
export const __dbhost__ = process.env.DATABASE_HOST;
export const __dbpassword__ = process.env.DATABASE_PASSWORD;
export const __firebaseKey__ =
  process.env.NODE_ENV === 'production' ? process.env.FIREBASE_KEY! : '';
export const __port__ = process.env.PORT;
