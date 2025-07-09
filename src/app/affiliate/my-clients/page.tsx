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
import { Progress } from '@/components/ui/progress';

// Mock data for demonstration
const clients = [
  {
    id: 1,
    name: 'Jane Doe',
    status: 'Active',
    dateSubmitted: '2024-07-10',
    initialScore: 580,
    currentScore: 650,
  },
  {
    id: 2,
    name: 'John Smith',
    status: 'Active',
    dateSubmitted: '2024-07-09',
    initialScore: 620,
    currentScore: 685,
  },
  {
    id: 3,
    name: 'Peter Jones',
    status: 'Completed',
    dateSubmitted: '2024-07-05',
    initialScore: 550,
    currentScore: 710,
  },
   {
    id: 4,
    name: 'Samantha Bee',
    status: 'Onboarding',
    dateSubmitted: '2024-07-12',
    initialScore: 610,
    currentScore: 610,
  },
];

export default function MyClientsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Client Submissions</CardTitle>
          <CardDescription>
            Track the credit score progress of your referred clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Initial Score</TableHead>
                <TableHead>Current Score</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
                <TableHead className="text-right">Date Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const scoreChange = client.currentScore - client.initialScore;
                // Scale progress so a 150 point gain fills the bar (150 / 1.5 = 100%)
                const progressValue = scoreChange > 0 ? Math.min(scoreChange, 150) / 1.5 : 0;
                const scoreChangeColor = scoreChange > 0 ? 'text-green-600' : scoreChange < 0 ? 'text-red-600' : 'text-muted-foreground';

                return (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                       <Badge variant={client.status === 'Completed' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.initialScore}</TableCell>
                    <TableCell className="font-semibold">{client.currentScore}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-12 text-sm font-medium ${scoreChangeColor}`}>
                          {scoreChange > 0 ? `+${scoreChange}` : scoreChange} pts
                        </span>
                        <Progress value={progressValue} className="w-full" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{client.dateSubmitted}</TableCell>
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
