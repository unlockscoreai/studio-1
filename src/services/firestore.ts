import { collection, addDoc, Timestamp, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "/home/user/studio-1/lib/firebase"; // Assuming you have exported db from firebase.ts

interface ClientData {
  email: string;
  fullName: string;
  clientType: 'personal' | 'business';
  unlockedTools: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

async function createClient(email: string, fullName: string, scanType: 'personal' | 'business'): Promise<string> {
  try {
    const clientsCollection = collection(db, "clients");
    const newClientData: ClientData = {
      email,
      fullName,
      clientType: scanType,
      unlockedTools: [`${scanType}Scan`],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(clientsCollection, newClientData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to create client.");
  }
}

interface AnalysisData {
  clientId: string;
  scanType: 'personal' | 'business';
  analysisData: object; // Use a more specific type if you have one for your analysis
  generatedAt: Timestamp;
}

async function saveAnalysis(clientId: string, scanType: 'personal' | 'business', analysisData: object): Promise<string> {
  try {
    const analysesCollection = collection(db, "analyses");
    const newAnalysisData: AnalysisData = {
      clientId,
      scanType,
      analysisData,
      generatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(analysesCollection, newAnalysisData);
    return docRef.id;
  } catch (e) {
    console.error("Error adding analysis document: ", e);
    throw new Error("Failed to save analysis.");
  }
}

async function findClientByEmail(email: string): Promise<{ id: string; data: ClientData } | null> {
  try {
    const clientsCollection = collection(db, "clients");
    const q = query(clientsCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, data: doc.data() as ClientData };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error finding client by email: ", e);
    throw new Error("Failed to find client.");
  }
}

async function findClientById(clientId: string): Promise<{ id: string; data: ClientData } | null> {
  try {
    const clientDocRef = doc(db, "clients", clientId);
    const clientSnapshot = await getDoc(clientDocRef);

    if (clientSnapshot.exists()) {
      return { id: clientSnapshot.id, data: clientSnapshot.data() as ClientData };
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error finding client by ID: ", e);
    throw new Error("Failed to find client by ID.");
  }
}