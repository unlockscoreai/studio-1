'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Define a type for the client data (adjust based on your Firestore structure)
interface ClientData {
  fullName: string;
  clientType: 'personal' | 'business';
  email: string;
  unlockedTools: string[];
  // Add other fields as needed
}


export default function ActivateClientPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const { toast } = useToast();

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md text-center text-red-500">
          <CardHeader>
            <CardTitle>Invalid Activation Link</CardTitle>
            <CardDescription>The activation token is missing from the URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please ensure you have the complete activation link from your email.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>Create a password to access your UnlockScore AI client portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={async (e) => {
            e.preventDefault();
            setPasswordError(null);
            setIsCreatingUser(true);

            if (password !== confirmPassword) {
              setPasswordError('Passwords do not match.');
              setIsCreatingUser(false);
              return;
            }

            // Basic password length check (can be enhanced with Zod)
            if (password.length < 6) {
                 setPasswordError('Password must be at least 6 characters long.');
                 setIsCreatingUser(false);
                 return;
            }


            try {
              const response = await fetch('/api/activate-client', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
              });

              const result = await response.json();

              if (response.ok) {
                toast({
                  title: 'Account Activated',
                  description: result.message || 'Your account has been successfully activated. You can now log in.',
                });
                // Redirect to login page after successful activation
                 // You might want to redirect to a specific login page
                 router.push('/sign-in'); // Assuming you have a sign-in page

              } else {
                setPasswordError(result.error || 'An error occurred during activation.');
                 toast({
                   variant: "destructive",
                   title: "Activation Failed",
                   description: result.error || "An unexpected error occurred during activation.",
                 });
              }

            } catch (err: any) {
              console.error('Error during activation API call:', err);
 setPasswordError('An unexpected error occurred. Please try again.');
               });
            } finally {
              setIsCreatingUser(false);
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isCreatingUser} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isCreatingUser} />
            </div>
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <Button type="submit" className="w-full" disabled={isCreatingUser}>
              {isCreatingUser ? 'Activating...' : 'Activate Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}