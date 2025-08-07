'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase'; // Assuming client-side auth is exported from here
import { findClientById, getLatestAnalysisForClient } from '@/services/firestore'; // Need to implement getLatestAnalysisForClient
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientData {
  // Define structure of your client data
  fullName: string;
  clientType: string;
  // Add other fields as needed
}

interface AnalysisData {
  // Define structure of your analysis data
  summary: string;
  disputableItems?: Array<{ item: string; reason: string; successProbability: number }>;
  actionItems?: string[]; // Assuming action items are stored as an array
  scanType: string; // Add scanType to analysis data
  // Add other fields as needed
}

export default function PersonalClientPortalPage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [client, setClient] = useState<ClientData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        // If not authenticated, redirect to login
        router.push('/sign-in');
      } else {
        // If authenticated, fetch client and analysis data
        const fetchData = async () => {
          setIsLoadingData(true);
          setErrorData(null);
          try {
            const clientDoc = await findClientById(user.uid);

            if (!clientDoc) {
              setErrorData('Client not found.');
              setIsLoadingData(false);
              return;
            }

            setClient(clientDoc.data as ClientData);

            const latestPersonalAnalysis = await getLatestAnalysisForClient(clientDoc.id, 'personal');

            if (!latestPersonalAnalysis) {
              setErrorData('Personal analysis not found for this client.');
              setIsLoadingData(false);
              return;
            }

            setAnalysis(latestPersonalAnalysis.data as AnalysisData);

          } catch (err: any) {
            console.error("Error fetching client or analysis data:", err);
            setErrorData(`Failed to load data: ${err.message}`);
          } finally {
            setIsLoadingData(false);
          }
        };

        fetchData();
      }
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth || isLoadingData) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (errorAuth) {
    return <div className="container mx-auto p-6 text-red-500">Authentication Error: {errorAuth.message}</div>;
  }

  if (errorData) {
    return <div className="container mx-auto p-6 text-red-500">Data Error: {errorData}</div>;
  }

  if (!user) {
    // This case should be handled by the redirect in useEffect, but added for clarity
    return <div className="container mx-auto p-6 text-red-500">Access Denied. Please log in.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {client?.fullName}!</h1>
      <p className="text-muted-foreground mb-6">Your Personal Credit Analysis Overview</p>

      {/* Placeholder for displaying analysis details */}
      <div className="space-y-6">
        {analysis?.summary && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Summary</h2>
            <p>{analysis.summary}</p>
          </div>
        )}

        {analysis?.disputableItems && analysis.disputableItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Disputable Items</h2>
            {/* Render disputable items, perhaps in a table */}
            <p>Display table of disputable items here.</p>
            {/* Example: <DisputableItemsTable items={analysis.disputableItems} /> */}
          </div>
        )}

         {analysis?.actionItems && analysis.actionItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Plan of Action</h2>
            {/* Render action items as a list */}
             <p>Display plan of action list here.</p>
             {/* Example: <ul>{analysis.actionItems.map((item, index) => <li key={index}>{item}</li>)}</ul> */}
          </div>
        )}

        {!analysis?.summary && (!analysis?.disputableItems || analysis.disputableItems.length === 0) && (!analysis?.actionItems || analysis.actionItems.length === 0) && (
            <p>No detailed analysis data available yet.</p>
        )}
      </div>

      {/* Add navigation or links to other personal client tools here */}
       <div className="mt-8">
           <h2 className="text-2xl font-semibold mb-2">Your Tools</h2>
           {/* Conditionally render links based on unlockedTools in client document */}
           {/* Example: {client?.unlockedTools?.includes('personalScan') && <Link href="/client/personal/scan">Personal Scan Tool</Link>} */}
            <p>Links to unlocked personal client tools will appear here.</p>
       </div>
    </div>
  );
}