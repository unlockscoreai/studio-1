"use client";

import type { AnalyzeBusinessCreditReportOutput } from "@/ai/flows/analyze-business-credit-report";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";

interface BusinessReportCardProps {
    analysis: AnalyzeBusinessCreditReportOutput;
}

const InfoItem = ({ label, value }: { label: string, value: string | number | undefined }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value || "N/A"}</p>
    </div>
);

export function BusinessReportCard({ analysis }: BusinessReportCardProps) {
    const { businessSummary, creditScoreBreakdown, riskFactors, fundabilityGrade, actionPlan } = analysis;
    
    const gradeColor = () => {
        if (['A', 'B'].includes(fundabilityGrade.charAt(0))) return 'bg-green-600';
        if (['C'].includes(fundabilityGrade.charAt(0))) return 'bg-yellow-500';
        return 'bg-red-600';
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Unlock Score AI – Business Credit Fundability Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Business Summary */}
                <section>
                    <h3 className="font-headline text-lg font-semibold mb-3">📌 Business Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Business Name" value={businessSummary.businessName} />
                        <InfoItem label="DUNS Number" value={businessSummary.dunsNumber} />
                        <InfoItem label="Entity Type" value={businessSummary.entityType} />
                        <InfoItem label="Years in Business" value={businessSummary.yearsInBusiness} />
                        <InfoItem label="Monthly Revenue" value={businessSummary.monthlyRevenue} />
                    </div>
                </section>

                <Separator />

                {/* Credit Score Breakdown */}
                <section>
                    <h3 className="font-headline text-lg font-semibold mb-3">📈 Credit Score Breakdown</h3>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Paydex Score (D&B)" value={creditScoreBreakdown.paydexScore} />
                        <InfoItem label="Experian Intelliscore" value={creditScoreBreakdown.experianIntelliscore} />
                        <InfoItem label="Equifax Business Score" value={creditScoreBreakdown.equifaxBusinessScore} />
                        <InfoItem label="# of Active Tradelines" value={creditScoreBreakdown.activeTradelines} />
                        <InfoItem label="Average Account Age" value={creditScoreBreakdown.averageAccountAge} />
                        <InfoItem label="Credit Utilization" value={creditScoreBreakdown.creditUtilization} />
                    </div>
                </section>
                
                <Separator />

                {/* Fundability & Risk */}
                <section className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-headline text-lg font-semibold mb-3">🏆 Fundability Grade</h3>
                        <div className="flex items-center gap-4">
                            <Badge className={`text-4xl font-bold px-4 py-2 ${gradeColor()}`}>{fundabilityGrade}</Badge>
                            <p className="text-sm text-muted-foreground">Based on structure, trade history, credit usage, and risk items.</p>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-headline text-lg font-semibold mb-3">🚨 Risk Factors</h3>
                        {riskFactors.length > 0 ? (
                            <ul className="space-y-2">
                                {riskFactors.map((factor, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span>{factor}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No significant risk factors identified.</p>
                        )}
                    </div>
                </section>

                <Separator />

                {/* Action Plan */}
                <section>
                    <h3 className="font-headline text-lg font-semibold mb-3">✅ AI Action Plan</h3>
                    <ul className="space-y-3">
                        {actionPlan.map((step, i) => (
                             <li key={i} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                <p className="text-muted-foreground">{step}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </CardContent>
        </Card>
    );
}
