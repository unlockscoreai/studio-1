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
import { TrendingUp } from 'lucide-react';

const successfulClients = [
  { id: 1, businessName: 'Volunteer Express Logistics LLC', growthScore: 85, paydexScore: 80, personalFico: 750 },
  { id: 2, businessName: 'Main Street Cafe', growthScore: 78, paydexScore: 75, personalFico: 680 },
  { id: 3, businessName: 'Innovate Tech Corp', growthScore: 92, paydexScore: 68, personalFico: 710 },
  { id: 4, businessName: 'Global Solutions Inc', growthScore: 75, paydexScore: 82, personalFico: 725 },
  { id: 5, businessName: 'Summit Peak Ventures', growthScore: 81, paydexScore: 72, personalFico: 740 },
];

export default function BusinessGrowthPage() {
  const getScoreColor = (score: number) => {
    if (score >= 720) return 'bg-green-600 hover:bg-green-600/80';
    if (score >= 680) return 'bg-yellow-500 hover:bg-yellow-500/80';
    return 'bg-red-600 hover:bg-red-600/80';
  };
    const getBizScoreColor = (score: number, threshold: number) => {
    return score >= threshold ? 'bg-green-600 hover:bg-green-600/80' : 'bg-secondary text-secondary-foreground';
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Business Growth Champions
          </CardTitle>
          <CardDescription>
            A list of your referred clients achieving top-tier business credit status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Growth Score</TableHead>
                <TableHead>Paydex Score</TableHead>
                <TableHead className="text-right">Personal FICO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {successfulClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.businessName}</TableCell>
                  <TableCell>
                    <Badge variant="default" className={getBizScoreColor(client.growthScore, 80)}>
                      {client.growthScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className={getBizScoreColor(client.paydexScore, 70)}>
                      {client.paydexScore}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="default" className={getScoreColor(client.personalFico)}>
                      {client.personalFico}
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
