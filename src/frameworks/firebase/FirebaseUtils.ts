import { doc, Firestore, getDoc } from "firebase/firestore";

export async function isDocumentEmpty(firestore: Firestore, path: string, ...pathSegments: string[]): Promise<boolean> {
  const ref = doc(firestore, path, ...pathSegments);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return true;
  const data = snapshot.data();
  return Object.keys(data).length === 0;
}