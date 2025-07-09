import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Account Settings</CardTitle>
        <CardDescription>
          This is a placeholder for the client account page. Manage your profile and subscription here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Account settings form will go here.</p>
      </CardContent>
    </Card>
  );
}
