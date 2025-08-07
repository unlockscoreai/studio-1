'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerateLetterForm } from "@/components/dashboard/generate-letter-form"
import { ImproveLetterForm } from "@/components/dashboard/improve-letter-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { findClientById } from '@/services/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [clientData, setClientData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      if (user) {
        const data = await findClientById(user.uid);
        setClientData(data);
        setLoadingData(false);
      } else if (!loadingAuth) {
        setLoadingData(false);
      }
    };

    fetchClientData();
  }, [user, loadingAuth]);

  if (loadingAuth || loadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate New Letter</TabsTrigger>
          <TabsTrigger value="improve">Improve Existing Letter</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="space-y-4">
          {clientData && (
            <GenerateLetterForm clientData={clientData} />
          )}
        </TabsContent>
        <TabsContent value="improve" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Improve Your Letter</CardTitle>
              <CardDescription>
                Paste your existing letter and our AI will analyze and enhance it for maximum effectiveness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImproveLetterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
