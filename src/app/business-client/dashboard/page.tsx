import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BusinessReportCard } from "@/components/business/business-report-card";

// This is mock data representing the output from the `runBusinessScan` AI flow.
// In a real application, this would be fetched from your database after the initial scan.
const mockAnalysis = {
  unlockScore: 820,
  socialScore: 75,
  unlockTier: 'Highly Fundable',
  businessSummary: {
    businessName: 'Volunteer Express Logistics LLC',
    entityType: 'LLC',
    yearsInBusiness: '3',
    monthlyRevenue: '$75,000',
    status: 'Active',
    registeredAgent: 'C T CORPORATION SYSTEM',
    mailingAddress: '800 S GAY ST, SUITE 2102, KNOXVILLE, TN, 37929',
    lastHistoryUpdate: '2023-04-01',
    summaryText: "Volunteer Express Logistics LLC is an active and established Limited Liability Company with a strong online presence, including a professional website and positive Google reviews. The business appears credible and well-positioned for the next steps in building its financial profile.",
  },
  creditScoreBreakdown: {
    paydexScore: "80",
    experianIntelliscore: "75",
    equifaxBusinessScore: "N/A",
  },
  riskFactors: [
    "Equifax Business score not established.",
    "No recent updates to social media profiles."
  ],
  actionPlan: [
    "Establish an Equifax Business credit profile by opening a new tradeline that reports to them.",
    "Increase social media activity on LinkedIn to build brand authority.",
    "Prepare your last 6 months of bank statements for upcoming funding applications."
  ],
  coachCallToAction: "Your business has a strong foundation! To create a custom plan to raise your Unlock Score™ and accelerate your growth, book a 30-minute, $99 consultation with one of our expert business coaches today."
};

export default function BusinessDashboardPage() {
  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Welcome to your Business Dashboard</CardTitle>
                <CardDescription>
                This is your central hub for managing and improving your business's funding readiness, measured by your Unlock Score™.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Use the navigation on the left to access your tools and reports.</p>
                <Button asChild className="mt-4">
                    <Link href="/business-client/get-reports">Get Your Credit Reports</Link>
                </Button>
            </CardContent>
        </Card>

        <BusinessReportCard analysis={mockAnalysis} />
    </div>
  );
}
