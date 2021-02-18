require('dotenv').config();

export const __prod__ = process.env.NODE_ENV === 'production';
export const __dbhost__ = process.env.DATABASE_HOST;
export const __dbname__ = process.env.DATABASE_NAME;
export const __dbuser__ = process.env.DATABASE_USER;
export const __dbpassword__ = process.env.DATABASE_PASSWORD;
export const __dbport__ = process.env.DATABASE_PORT;
export const __firebaseKey__ =
  process.env.NODE_ENV === 'production' ? process.env.FIREBASE_KEY! : '';
export const __port__ = process.env.PORT;
