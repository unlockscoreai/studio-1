'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle, Trash2, DollarSign } from 'lucide-react';

const weeklyData = {
  stats: {
    newReferrals: 15,
    onboardedClients: 8,
    itemsDeleted: 22,
    estimatedPayout: 400,
  },
  referralTrend: [
    { name: 'Week -3', referrals: 10 },
    { name: 'Week -2', referrals: 12 },
    { name: 'Week -1', referrals: 8 },
    { name: 'This Week', referrals: 15 },
  ],
  recentActivity: [
      { client: 'Jane Doe', activity: 'Onboarded', date: '2 days ago'},
      { client: 'John Smith', activity: 'Item Removed (Experian)', date: '3 days ago'},
      { client: 'Samantha Bee', activity: 'New Referral', date: '4 days ago'},
  ]
};

const monthlyData = {
  stats: {
    newReferrals: 52,
    onboardedClients: 35,
    itemsDeleted: 98,
    estimatedPayout: 1750,
  },
  referralTrend: [
    { name: 'Apr', referrals: 45 },
    { name: 'May', referrals: 60 },
    { name: 'Jun', referrals: 48 },
    { name: 'Jul', referrals: 52 },
  ],
  recentActivity: [
      { client: 'Peter Jones', activity: 'Reached 700 Club', date: '1 week ago'},
      { client: 'Emily Davis', activity: 'Onboarded', date: '2 weeks ago'},
      { client: 'Michael Chen', activity: 'Item Removed (Equifax)', date: '3 weeks ago'},
  ]
};

export default function ReportsPage() {
  return (
    <Tabs defaultValue="weekly" className="space-y-4">
      <TabsList>
        <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
      </TabsList>
      
      {/* Weekly Report Tab */}
      <TabsContent value="weekly" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.stats.newReferrals}</div>
              <p className="text-xs text-muted-foreground">in the last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Onboarded</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.stats.onboardedClients}</div>
               <p className="text-xs text-muted-foreground">completed ID verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Items Deleted</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyData.stats.itemsDeleted}</div>
              <p className="text-xs text-muted-foreground">across all clients this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${weeklyData.stats.estimatedPayout.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">for this week's activity</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Referral Trend</CardTitle>
                    <CardDescription>New client referrals over the last 4 weeks.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData.referralTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip />
                            <Bar dataKey="referrals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of recent events from your clients.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weeklyData.recentActivity.map((activity, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{activity.client}</TableCell>
                                    <TableCell>
                                        <Badge variant={activity.activity.includes('Removed') ? 'default' : 'secondary'}>{activity.activity}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </TabsContent>

      {/* Monthly Report Tab */}
      <TabsContent value="monthly" className="space-y-4">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyData.stats.newReferrals}</div>
              <p className="text-xs text-muted-foreground">in the last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Onboarded</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyData.stats.onboardedClients}</div>
               <p className="text-xs text-muted-foreground">completed ID verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Items Deleted</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyData.stats.itemsDeleted}</div>
              <p className="text-xs text-muted-foreground">across all clients this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Payout</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyData.stats.estimatedPayout.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">for this month's activity</p>
            </CardContent>
          </Card>
        </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Referral Trend</CardTitle>
                    <CardDescription>New client referrals over the last 4 months.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData.referralTrend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip />
                            <Bar dataKey="referrals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of recent events from your clients.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Activity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlyData.recentActivity.map((activity, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{activity.client}</TableCell>
                                    <TableCell>
                                        <Badge variant={activity.activity.includes('700') ? 'default' : 'secondary'} className={activity.activity.includes('700') ? 'bg-green-600' : ''}>{activity.activity}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
