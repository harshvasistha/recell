import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);

async function test() {
  const docRef = doc(db, 'system', 'catalog');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log("Found products:", snap.data().products.length);
  } else {
    console.log("No catalog doc");
  }
  process.exit(0);
}
test();
