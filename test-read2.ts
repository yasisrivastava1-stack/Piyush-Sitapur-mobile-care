import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const snapshot = await getDocs(collection(db, 'technicians'));
    console.log("Technicians count:", snapshot.size);
  } catch (e) {
    console.error("Error reading technicians:", e.message);
  }
  process.exit(0);
}

test();
