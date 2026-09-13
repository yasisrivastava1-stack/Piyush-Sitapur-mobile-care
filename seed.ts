import { db } from './src/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { SAMPLE_BOOKINGS, SITAPUR_TECHNICIANS, SITAPUR_REVIEWS, SAMPLE_SUPPORT_TICKETS } from './src/data/sitapurData';

async function seed() {
  console.log('Seeding Bookings...');
  for (const b of SAMPLE_BOOKINGS) {
    await setDoc(doc(db, 'bookings', b.id), b);
  }
  
  console.log('Seeding Technicians...');
  for (const t of SITAPUR_TECHNICIANS) {
    await setDoc(doc(db, 'technicians', t.id), { ...t, isAvailable: t.isActive });
  }

  console.log('Seeding Reviews...');
  for (const r of SITAPUR_REVIEWS) {
    await setDoc(doc(db, 'reviews', r.id), r);
  }

  console.log('Seeding Tickets...');
  for (const t of SAMPLE_SUPPORT_TICKETS) {
    await setDoc(doc(db, 'supportTickets', t.id), t);
  }
  
  console.log('Done!');
  process.exit(0);
}

seed().catch(console.error);
