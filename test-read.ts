import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
