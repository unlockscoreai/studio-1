import { collection, addDoc, Timestamp, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assuming you have exported db from firebase.ts

export interface ClientData {
  email: string;
  fullName: string;
  clientType: 'personal' | 'business';
  unlockedTools: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
interface NewClientData extends ClientData {
  assignedAffiliateId?: string; // Optional, will be set during creation by affiliate
  role: 'client' | 'affiliate'; // Added role field
}

export async function createClient(email: string, fullName: string, scanType: 'personal' | 'business', affiliateId?: string): Promise<string> {
  try {
    const newClientData: NewClientData = {
      email,
      fullName,
      clientType: scanType,
      unlockedTools: [`${scanType}Scan`],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    if (affiliateId) {
        newClientData.assignedAffiliateId = affiliateId;
        newClientData.role = 'client'; // Default new clients to 'client' role
    }

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

export async function saveAnalysis(clientId: string, scanType: 'personal' | 'business', analysisData: object): Promise<string> {
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

export async function findClientByEmail(email: string): Promise<{ id: string; data: ClientData } | null> {
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

export async function findClientById(clientId: string): Promise<{ id: string; data: ClientData } | null> {
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

export async function getLatestAnalysisForClient(clientId: string, scanType: 'personal' | 'business'): Promise<{ id: string; data: AnalysisData } | null> {
  try {
    const analysesCollection = collection(db, "analyses");
    const q = query(
      analysesCollection,
      where("clientId", "==", clientId),
      where("scanType", "==", scanType),
      orderBy("generatedAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, data: doc.data() as AnalysisData };
    } else {
      return null;
    }
  } catch (e) {
    console.error(`Error getting latest ${scanType} analysis for client ${clientId}: `, e);
    throw new Error(`Failed to get latest ${scanType} analysis.`);
  }
}