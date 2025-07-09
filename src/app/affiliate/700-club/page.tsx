import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

// Mock data for demonstration - clients with scores >= 700
const clubMembers = [
  {
    id: 3,
    name: 'Peter Jones',
    status: 'Completed',
    dateJoined: '2024-07-20',
    initialScore: 550,
    currentScore: 710,
  },
  {
    id: 5,
    name: 'Emily Davis',
    status: 'Active',
    dateJoined: '2024-07-22',
    initialScore: 640,
    currentScore: 725,
  },
  {
    id: 6,
    name: 'Michael Chen',
    status: 'Completed',
    dateJoined: '2024-07-18',
    initialScore: 680,
    currentScore: 750,
  },
];

export default function SevenHundredClubPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            UnlockScore AI 700 Club
          </CardTitle>
          <CardDescription>
            Celebrating the success of clients who have achieved a credit score of 700 or higher.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Current Score</TableHead>
                <TableHead>Initial Score</TableHead>
                <TableHead>Total Improvement</TableHead>
                <TableHead className="text-right">Date Joined the 700 Club</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clubMembers.map((client) => {
                const scoreImprovement = client.currentScore - client.initialScore;
                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600 hover:bg-green-600/80">
                        {client.currentScore}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.initialScore}</TableCell>
                    <TableCell className="text-green-600 font-semibold">+{scoreImprovement} pts</TableCell>
                    <TableCell className="text-right">{client.dateJoined}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
