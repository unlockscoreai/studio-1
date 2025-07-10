"use client";

import type { AnalyzeBusinessCreditReportOutput } from "@/ai/flows/analyze-business-credit-report";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TrendingUp, Handshake, Target, ShieldAlert } from "lucide-react";

interface BusinessReportCardProps {
    analysis: AnalyzeBusinessCreditReportOutput;
}

const InfoItem = ({ label, value }: { label: string, value: string | number | undefined }) => (
    value ? (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    ) : null
);

export function BusinessReportCard({ analysis }: BusinessReportCardProps) {
    const { fundabilityScore, businessSummary, creditScoreBreakdown, riskFactors, actionPlan } = analysis;
    
    const getScoreColor = () => {
        if (fundabilityScore >= 80) return 'bg-green-600';
        if (fundabilityScore >= 50) return 'bg-yellow-500';
        return 'bg-red-600';
    };

    return (
        <Card className="w-full border-t-4 border-primary">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Business Fundability Report</CardTitle>
                <CardDescription>An AI-powered analysis of your business's credit and funding readiness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                
                {/* Score & Summary */}
                <section className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <h3 className="font-headline text-lg font-semibold mb-2">Fundability Score</h3>
                         <div className="relative">
                            <div className={`text-5xl font-bold text-white px-6 py-4 rounded-full ${getScoreColor()}`}>{fundabilityScore}</div>
                            <div className="absolute -top-1 -right-1 p-2 bg-background rounded-full shadow-md">
                                <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 text-center">A score of 80+ is considered highly fundable.</p>
                    </div>
                    <div className="md:col-span-3">
                        <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Handshake /> Business Summary</h3>
                        <p className="text-muted-foreground">{businessSummary}</p>
                    </div>
                </section>

                <Separator />
                
                 {/* Credit Scores & Risks */}
                <section className="grid md:grid-cols-2 gap-8">
                     <div>
                        <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2"><ShieldAlert /> Risk Factors</h3>
                        {riskFactors.length > 0 ? (
                            <ul className="space-y-2">
                                {riskFactors.map((factor, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                        <span>{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <p>No significant public risk factors identified.</p>
                            </div>
                        )}
                    </div>
                     <div>
                        <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2"><TrendingUp /> Credit Score Breakdown</h3>
                        <div className="space-y-2">
                            <InfoItem label="Paydex Score (D&B)" value={creditScoreBreakdown.paydexScore} />
                            <InfoItem label="Experian Intelliscore" value={creditScoreBreakdown.experianIntelliscore} />
                            <InfoItem label="Equifax Business Score" value={creditScoreBreakdown.equifaxBusinessScore} />
                             {!creditScoreBreakdown.paydexScore && !creditScoreBreakdown.experianIntelliscore && (
                                <p className="text-sm text-muted-foreground">No credit report was uploaded. For a deeper analysis, upload a D&B, Experian, or Equifax business report.</p>
                             )}
                        </div>
                    </div>
                </section>

                <Separator />

                {/* Action Plan */}
                <section>
                    <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2"><Target /> Recommended Action Plan</h3>
                    <ul className="space-y-3">
                        {actionPlan.map((step, i) => (
                             <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0 mt-0.5">{i + 1}</div>
                                <p className="text-muted-foreground">{step}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </CardContent>
        </Card>
    );
}
