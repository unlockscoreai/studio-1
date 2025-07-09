import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DisputesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Disputes</CardTitle>
        <CardDescription>
          This is a placeholder for the client disputes page. Track all your dispute history here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>A detailed table of all disputes (active and past) will go here.</p>
      </CardContent>
    </Card>
  );
}
