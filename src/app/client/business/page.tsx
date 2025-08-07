'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Assuming you use this hook
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase'; // Assuming your client-side firebase is exported as auth
import { findClientById, getLatestAnalysisForClient } from '@/services/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BusinessClientPage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const router = useRouter();
  const [client, setClient] = useState<any | null>(null); // Consider a proper type
  const [analysis, setAnalysis] = useState<any | null>(null); // Consider a proper type
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    if (!loadingAuth) {
      if (!user) {
        // Redirect to sign-in if not authenticated
        router.push('/sign-in');
      } else {
        // Fetch client and analysis data
        const fetchData = async () => {
          setIsLoadingData(true);
          setErrorData(null);
          try {
            const clientData = await findClientById(user.uid);
            if (!clientData) {
              setErrorData('Client record not found.');
              setIsLoadingData(false);
              return;
            }
            setClient(clientData.data);

            const analysisData = await getLatestAnalysisForClient(clientData.id, 'business');

            setAnalysis(analysisData ? analysisData.data : null);
            setIsLoadingData(false);
          } catch (error) {
            console.error('Error fetching business client data:', error);
            setErrorData('Failed to load business analysis data.');
            setIsLoadingData(false);
          }
        };
        fetchData();
      }
    }
  }, [user, loadingAuth, router]);

  if (loadingAuth || isLoadingData) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (errorAuth) {
    return <div className="text-red-500">Authentication Error: {errorAuth.message}</div>;
  }

  if (errorData) {
    return <div className="text-red-500">Data Error: {errorData}</div>;
  }

  if (!user) {
    // This case should be handled by the redirect above, but as a fallback:
    return <div className="text-red-500">Access Denied. Please sign in.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Business Analysis for {client?.fullName}</h1>

      {analysis ? (
        <Card>
          <CardHeader>
            <CardTitle>Business Analysis Details</CardTitle>
            <CardDescription>Here is the latest business analysis for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Display business analysis data here */}
            <pre>{JSON.stringify(analysis, null, 2)}</pre> {/* Placeholder: Display raw data */}
            {/* Replace with actual UI components to display business analysis data */}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <CardTitle>No Business Analysis Found</CardTitle>
            <CardDescription className="mt-2">
              It looks like a business analysis has not been generated for your account yet.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Add other business-related components or tools here */}
    </div>
  );
}