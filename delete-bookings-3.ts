import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deleteAllBookings() {
  try {
    const querySnapshot = await getDocs(collection(db, 'bookings'));
    let count = 0;
    for (const document of querySnapshot.docs) {
      await deleteDoc(doc(db, 'bookings', document.id));
      count++;
    }
    console.log(`Deleted ${count} bookings successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error deleting bookings:", error);
    process.exit(1);
  }
}

deleteAllBookings();
