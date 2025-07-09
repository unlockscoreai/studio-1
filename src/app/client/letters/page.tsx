import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LettersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">My Letters</CardTitle>
        <CardDescription>
          This is a placeholder for the client letters page. View and manage all your generated letters here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>A list or library of generated dispute letters will go here.</p>
      </CardContent>
    </Card>
  );
}
