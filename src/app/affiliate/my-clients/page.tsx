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

// Mock data for demonstration
const clients = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane.d@example.com',
    status: 'Onboarding',
    dateSubmitted: '2024-07-10',
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john.s@example.com',
    status: 'In Review',
    dateSubmitted: '2024-07-09',
  },
  {
    id: 3,
    name: 'Peter Jones',
    email: 'peter.j@example.com',
    status: 'Completed',
    dateSubmitted: '2024-07-05',
  },
];

export default function MyClientsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Client Submissions</CardTitle>
          <CardDescription>
            You have submitted a total of {clients.length} clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.dateSubmitted}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === 'Completed' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
