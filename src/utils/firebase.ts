import * as admin from 'firebase-admin';
import credentials from '../../firebase.config.json';

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(credentials as admin.ServiceAccount),
});
