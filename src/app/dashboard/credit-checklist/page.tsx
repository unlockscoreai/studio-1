import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const personalCreditItems = [
    { id: 'fico', label: '700+ FICO score' },
    { id: 'lates', label: 'No late payments in past 24 months' },
    { id: 'util', label: 'Utilization < 10%' },
    { id: 'revolving', label: 'At least 2 primary revolving accounts' },
    { id: 'limit', label: '$5K+ limit on at least one primary' },
    { id: 'history', label: 'Credit history ≥ 2 years' },
    { id: 'installment', label: '1–2 installment accounts with ≥12 months payment history' },
    { id: 'inquiries', label: '<3 inquiries in last 6 months' },
    { id: 'au', label: 'Less than 1 AU tradeline' },
];

const businessCreditItems = [
    { id: 'ein', label: 'EIN + Business bank account' },
    { id: 'net30', label: 'At least 3 net-30 vendor accounts' },
    { id: 'bizscore', label: 'Business credit score (D&B, Experian) established' },
    { id: 'revenue', label: 'Monthly revenue: $10K+ (for funding)' },
    { id: 'statements', label: 'Clean 3–6 months of business bank statements' },
    { id: 'overdrafts', label: 'No recent overdrafts or negative days' },
];

const supportingDocsItems = [
    { id: 'license', label: 'Driver’s license' },
    { id: 'address', label: 'Proof of address' },
    { id: 'income', label: '2 months of paystubs or income' },
    { id: 'bizdocs', label: 'Business incorporation docs (if applying for biz credit)' },
];

function ChecklistItem({ id, label }: { id: string, label: string }) {
    return (
        <div className="flex items-center space-x-3">
            <Checkbox id={id} disabled />
            <Label htmlFor={id} className="text-base text-muted-foreground">{label}</Label>
        </div>
    );
}

export default function CreditChecklistPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Unlock Score Readiness Checklist</CardTitle>
                    <CardDescription>
                        Use this checklist as a guide to building a strong credit profile for a high Unlock Score.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold font-headline text-primary">A. Personal Credit (FICO)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {personalCreditItems.map(item => <ChecklistItem key={item.id} {...item} />)}
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold font-headline text-primary">B. Business Credit (if applicable)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {businessCreditItems.map(item => <ChecklistItem key={item.id} {...item} />)}
                        </div>
                    </div>
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold font-headline text-primary">C. Supporting Docs for Underwriting</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {supportingDocsItems.map(item => <ChecklistItem key={item.id} {...item} />)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
