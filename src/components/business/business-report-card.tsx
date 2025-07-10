"use client";

import type { AnalyzeBusinessCreditReportOutput } from "@/ai/flows/analyze-business-credit-report";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, TrendingUp, Handshake, Target, ShieldAlert, Calendar } from "lucide-react";

interface BusinessReportCardProps {
    analysis: AnalyzeBusinessCreditReportOutput;
}

const InfoItem = ({ label, value }: { label: string, value: string | number | null | undefined }) => (
    value || value === 0 ? (
        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-semibold text-sm">{value}</p>
        </div>
    ) : null
);

export function BusinessReportCard({ analysis }: BusinessReportCardProps) {
    const { fundabilityScore, socialScore, fundabilityGrade, businessSummary, creditScoreBreakdown, riskFactors, actionPlan, coachCallToAction } = analysis;
    
    const getScoreColor = () => {
        if (fundabilityScore >= 80) return 'bg-green-600';
        if (fundabilityScore >= 60) return 'bg-yellow-500';
        return 'bg-red-600';
    };

    return (
        <Card className="w-full border-t-4 border-primary">
            <CardHeader className="text-center pb-4">
                <CardTitle className="font-headline text-2xl">Business Fundability Report for {businessSummary.businessName}</CardTitle>
                <CardDescription>An AI-powered analysis of your business's credit and funding readiness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
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
                        <p className="text-sm text-muted-foreground mt-3 text-center">Grade: <span className="font-bold">{fundabilityGrade}</span> (A score of 80+ is highly fundable)</p>
                    </div>
                    <div className="md:col-span-3">
                        <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Handshake /> Business Summary</h3>
                        <p className="text-muted-foreground mb-4">{businessSummary.summaryText}</p>
                        <div className="space-y-1">
                            <InfoItem label="Entity Type" value={businessSummary.entityType} />
                            <InfoItem label="Years in Business" value={businessSummary.yearsInBusiness} />
                            <InfoItem label="Monthly Revenue" value={businessSummary.monthlyRevenue} />
                            <InfoItem label="SoS Status" value={businessSummary.status} />
                            <InfoItem label="Social Score" value={socialScore} />
                        </div>
                    </div>
                </section>

                <Separator />
                
                 {/* Credit Scores & Risks */}
                <section className="grid md:grid-cols-2 gap-8">
                     <div>
                        <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2"><ShieldAlert /> Key Risk Factors</h3>
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
                             {!creditScoreBreakdown.paydexScore && !creditScoreBreakdown.experianIntelliscore && !creditScoreBreakdown.equifaxBusinessScore &&(
                                <p className="text-sm text-muted-foreground pt-2">No credit report was uploaded. For a deeper analysis, upload a D&B, Experian, or Equifax business report.</p>
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

                 <Separator />

                {/* Coach CTA */}
                <section className="text-center bg-secondary p-6 rounded-lg">
                    <h3 className="font-headline text-lg font-semibold mb-3 flex items-center justify-center gap-2"><Calendar className="text-primary"/> Book Your Custom Funding Plan</h3>
                    <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">{coachCallToAction}</p>
                    <Button>
                        Book an Appointment
                    </Button>
                </section>

            </CardContent>
        </Card>
    );
}
