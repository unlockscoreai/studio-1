import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditScoreChart } from '@/components/client/credit-score-chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Trash2, FileClock, Sparkles } from 'lucide-react';

const disputes = [
  { bureau: 'Experian', item: 'Late Payment - Capital One', status: 'Submitted', statusVariant: 'secondary' as const },
  { bureau: 'Equifax', item: 'Incorrect Balance - Chase', status: 'Bureau Responded', statusVariant: 'outline' as const },
  { bureau: 'TransUnion', item: 'Unknown Inquiry', status: 'Submitted', statusVariant: 'secondary' as const },
  { bureau: 'Experian', item: 'Collection Account - XYZ', status: 'Removed', statusVariant: 'default' as const },
];

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">720</div>
            <p className="text-xs text-muted-foreground text-green-600">+50 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Removed</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+1 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Awaiting bureau response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Score Progress</CardTitle>
              <CardDescription>Your credit score over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreditScoreChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Active Disputes</CardTitle>
              <CardDescription>Track the status of your ongoing disputes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bureau</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute, index) => (
                    <TableRow key={index}>
                      <TableCell>{dispute.bureau}</TableCell>
                      <TableCell className="font-medium">{dispute.item}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={dispute.statusVariant} className={dispute.status === 'Removed' ? 'bg-green-600 hover:bg-green-600/80' : ''}>
                          {dispute.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-accent/80 to-primary/80 text-primary-foreground border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Upgrade to VIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/90 mb-4">
                Let us handle the mailing, follow-ups, and advanced dispute tactics for you. Accelerate your results with our full-service VIP plan.
              </p>
              <Button variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
