
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, Check, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import Link from "next/link";

const growthData = {
  score: 78, // out of 100
  checklistProgress: 80, // percentage
  tradelinesAdded: 5,
  fundingSecured: 25000,
  historicalScore: [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 55 },
    { month: 'Mar', score: 62 },
    { month: 'Apr', score: 70 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 78 },
  ],
  nextMilestones: [
    { icon: Briefcase, text: "Apply for 2+ Tier 2 store credit accounts to diversify your profile.", href: "/business-client/vendor-accounts" },
    { icon: DollarSign, text: "Prepare financial statements (P&L, Balance Sheet) for upcoming loan applications.", href: "/business-client/account" },
    { icon: Check, text: "Complete the final items on your Business Foundation checklist.", href: "/business-client/account" },
  ]
};

const chartConfig = {
  score: {
    label: "Growth Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function BusinessGrowthPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6">
                    <CardTitle className="mb-4 text-xl font-headline">Business Growth Score</CardTitle>
                    <div
                        className="relative w-40 h-40 flex items-center justify-center rounded-full"
                        style={{ background: `conic-gradient(hsl(var(--primary)) ${growthData.score * 3.6}deg, hsl(var(--muted)) 0deg)` }}
                    >
                        <div className="absolute w-32 h-32 bg-background rounded-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary">{growthData.score}</span>
                        </div>
                    </div>
                     <p className="text-muted-foreground mt-4 text-center">Your path to fundability is looking strong!</p>
                </Card>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Checklist Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={growthData.checklistProgress} className="mb-2" />
                            <p className="text-2xl font-bold">{growthData.checklistProgress}% Complete</p>
                            <p className="text-xs text-muted-foreground">across all foundation items</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">New Tradelines Added</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-2xl font-bold">{growthData.tradelinesAdded}</p>
                            <p className="text-xs text-muted-foreground">vendor and financial accounts</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Total Funding Secured</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-2xl font-bold">${growthData.fundingSecured.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">in credit and loans</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Next Goal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">85 Growth Score</p>
                            <p className="text-xs text-muted-foreground">Unlock higher-tier funding</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        Growth Over Time
                    </CardTitle>
                    <CardDescription>
                        Your Business Growth Score progress over the last 6 months.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="h-64 w-full">
                        <LineChart data={growthData.historicalScore} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                                activeDot={{ r: 6 }}
                                />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        Your Next Milestones
                    </CardTitle>
                    <CardDescription>
                        Complete these tasks to boost your growth score and unlock new funding opportunities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {growthData.nextMilestones.map((milestone, index) => (
                        <Link href={milestone.href} key={index} className="block">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex-shrink-0 pt-1">
                                    <milestone.icon className="h-6 w-6 text-primary" />
                                </div>
                                <p className="text-muted-foreground">{milestone.text}</p>
                            </div>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
