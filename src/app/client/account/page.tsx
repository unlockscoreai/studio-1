
'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AccountPage() {
  const [name, setName] = useState('Sarah Lee');
  const [email, setEmail] = useState('sarah.lee@example.com');
  const [avatarPreview, setAvatarPreview] = useState('https://i.pravatar.cc/150?u=a042581f4e29026704d');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setIsLoading(true);
    // Simulate saving data
    setTimeout(() => {
        setIsLoading(false);
        toast({
            title: 'Profile Updated',
            description: 'Your account information has been saved successfully.',
        });
    }, 1000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Account</CardTitle>
        <CardDescription>
          Manage your profile information and subscription settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview} alt="User Avatar" />
                <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button asChild>
                        <span >Upload New Picture</span>
                    </Button>
                </Label>
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 5MB.</p>
            </div>
        </div>
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
        </div>
        <div className="space-y-2">
            <h3 className="font-semibold">Subscription</h3>
            <div className="p-4 border rounded-lg bg-secondary flex justify-between items-center">
                <div>
                    <p className="font-medium">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">Next payment: August 1, 2024</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
            </div>
        </div>
      </CardContent>
      <CardFooter>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
      </CardFooter>
    </Card>
  );
}
