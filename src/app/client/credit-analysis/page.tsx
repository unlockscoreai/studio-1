'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileWarning,
  Target,
  FileHeart,
  CheckCircle,
  Home,
  Car,
  Users,
  User,
  AlertOctagon,
  FileUp,
  Landmark,
  UserCheck,
  ShieldQuestion, 
  UploadCloud,
  ExternalLink,
  Info,
} from "lucide-react";
import { AnalyzeCreditProfileOutput, DisputableItem } from "@/ai/flows/analyze-credit-profile"; // Import DisputableItem
import { useState, useEffect, ReactNode } from 'react';
import { ReactElement, JSXElementConstructor, ReactPortal, AwaitedReactNode, Key } from 'react'; // Added missing React types
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
// import { auth } from '@/lib/firebase';
// import { onAuthStateChanged } from 'firebase/auth';


const StatCard = ({
  icon: Icon,
  title,
  value,
  variant = 'default',
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  variant?: 'default' | 'positive' | 'negative';
}) => {
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    positive: 'bg-green-100 text-green-700',
    negative: 'bg-red-100 text-red-700',
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${variantClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const MissingScoreInfo = ({ bureauUrl, bureauName }: { bureauUrl: string, bureauName: string }) => (
    <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-muted/50 h-full">
        <Info className="w-8 h-8 text-amber-500 mb-2" />
        <p className="font-semibold text-muted-foreground mb-2">Score Not Available</p>
        <p className="text-xs text-muted-foreground mb-3">
            This could mean your credit file with {bureauName} is frozen or blocked.
        </p>
        <Button asChild variant="outline" size="sm">
            <a href={bureauUrl} target="_blank" rel="noopener noreferrer">
                Get Report <ExternalLink className="ml-2 h-3 w-3" />
            </a>
        </Button>
    </div>
);


const ScoreCard = ({ bureau, score }: { bureau: string; score: number }) => {
  let ringColor = 'ring-yellow-500';
  if (score >= 740) ringColor = 'ring-green-500';
  else if (score > 0 && score < 670) ringColor = 'ring-red-500';

  const bureauLinks: { [key: string]: string } = {
    'Experian': 'https://www.experian.com/freeze/center.html',
    'TransUnion': 'https://www.transunion.com/credit-freeze',
    'Equifax': 'https://www.equifax.com/personal/credit-report-services/credit-freeze/',
  };
  
  const getCreditKarmaLink = (bureau: string) => {
    // Credit Karma provides both, but we can deep-link if needed in the future.
    return 'https://www.creditkarma.com/';
  }

  const reportUrl = bureau === 'Experian' ? bureauLinks.Experian : getCreditKarmaLink(bureau);


  return (
    <div className="flex flex-col items-center justify-center space-y-2">
       {score > 0 ? (
            <div
                className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-muted/50 text-4xl font-bold ring-8 ${ringColor}`}
            >
                {score}
            </div>
        ) : (
            <div className="h-32 w-32">
                <MissingScoreInfo bureauUrl={reportUrl} bureauName={bureau} />
            </div>
        )}
      <p className="font-semibold text-muted-foreground">{bureau}</p>
    </div>
  );
};

const NoAnalysisFound = () => {
    return (
        <Card className="text-center p-10 flex flex-col items-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
                <FileUp className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">No Analysis Generated Yet</CardTitle>
            <CardDescription className="mt-2 mb-6 max-w-md mx-auto">
                It looks like you haven't scanned a credit report yet. Go to the "New Scan" page to upload your report and get your free AI-powered analysis.
            </CardDescription>
             <Button asChild>
                <Link href="/dashboard/scan">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Go to New Scan
                </Link>
            </Button>
        </Card>
    );
};


export default function CreditAnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalyzeCreditProfileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isDemo = sessionStorage.getItem('isDemo') === 'true';
    if (isDemo) {
        // If using mock data, ensure it matches the AnalyzeCreditReportOutput type
        // setAnalysis(adminMockAnalysis); 
        setIsLoading(false);
        return;
    }
    
    const storedAnalysis = sessionStorage.getItem('analysisResult');
    if (storedAnalysis) {
        setAnalysis(JSON.parse(storedAnalysis));
    }
    setIsLoading(false);

  }, []);

  if (isLoading) {
      return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-64 w-full" />
        </div>
      );
  }

  if (!analysis) {
    return <NoAnalysisFound />;
  }

  const actionItems = analysis.planOfAction
    .split(/\n/)
    .filter((line: string) => line.trim().startsWith('- ') || line.trim().startsWith('####'))
    .map((line: string) => line.replace(/- /g, '').replace(/#### /g, ''));


  return (
    <div className="space-y-6">
       {analysis.customerInfo && (
        <div>
          <h1 className="text-3xl font-bold font-headline">Credit Analysis for {analysis.customerInfo.fullName}</h1>
          <p className="text-muted-foreground">
              {analysis.customerInfo.referredBy ? `Referred by: ${analysis.customerInfo.referredBy}` : "Here is your detailed credit analysis."}
          </p>
        </div>
       )}
      
       {analysis.creditScores && (
        <Card>
            <CardHeader>
            <CardTitle>Credit Scores (FICO 8)</CardTitle>
            <CardDescription>
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-xs mt-2">
                    <span className="font-semibold">External Links:</span>
                    <a href="https://www.experian.com/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">Experian <ExternalLink className="h-3 w-3" /></a>
                    <a href="https://www.creditkarma.com/" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">Credit Karma (for TU & Equifax) <ExternalLink className="h-3 w-3" /></a>
                </div>
            </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-3">
            <ScoreCard bureau="Experian" score={analysis.creditScores.experian} />
            <ScoreCard bureau="TransUnion" score={analysis.creditScores.transunion} />
            <ScoreCard bureau="Equifax" score={analysis.creditScores.equifax} />
            </CardContent>
        </Card>
       )}
      
       <Card>
        <CardHeader>
          <CardTitle>At a Glance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Landmark} title="Open Accounts" value={analysis.summary.openAccounts} />
            <StatCard icon={Target} title="Hard Inquiries" value={analysis.summary.inquiries} variant="negative" />
            <StatCard icon={AlertOctagon} title="Negative Items" value={analysis.summary.negativeAccounts} variant="negative" />
            <StatCard icon={FileWarning} title="Derogatory Items" value={analysis.summary.derogatoryItems} variant="negative" />
            <StatCard icon={User} title="Primary Accounts" value={analysis.summary.primaryTradelines} />
            <StatCard icon={Users} title="Authorized Users" value={analysis.summary.authorizedUserTradelines} />
            <StatCard icon={Car} title="Auto Loans" value={analysis.summary.hasAutoInstallment ? "Yes" : "No"} />
            <StatCard icon={Home} title="Mortgage" value={analysis.summary.hasMortgage ? "Yes" : "No"} />
        </CardContent>
      </Card>
      
      {analysis.disputableItems && analysis.disputableItems.length > 0 && (
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <ShieldQuestion className="h-6 w-6 text-primary" />
                      Dispute Opportunities
                  </CardTitle>
                  <CardDescription>
                      Our AI has identified these items as potential candidates for dispute.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Creditor</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date Reported</TableHead>
                              <TableHead>Success Chance</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody> 
                          {analysis.disputableItems.map((item: DisputableItem, index) => (
                              <TableRow key={index}>
                                  <TableCell className="font-medium">{item.creditorName}</TableCell>
                                  <TableCell><Badge variant={item.type === 'Collection' ? 'destructive' : 'secondary'}>{item.type}</Badge></TableCell>
                                  <TableCell>{item.dateReported}</TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-2" typeof="number"> {/* Added typeof for clarity */}
                                          <Progress value={item.disputeSuccessChance} className="w-24" />
                                          <span className="text-muted-foreground font-medium">{item.disputeSuccessChance != null ? `${item.disputeSuccessChance}%` : 'N/A'}</span> {/* Handle null/undefined */}
                                      </div> 
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
      )}


      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileHeart className="h-6 w-6 text-primary" />
            Your AI Action Plan
          </CardTitle>
          <CardDescription>
            This AI-powered analysis is based on the credit report you
            uploaded. Follow these steps to improve your score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div>
            <div className="space-y-4">
              {actionItems.slice(1).map((item: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                 <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
