
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Define the new stages for personal clients
const personalPipelineData = {
    analysisComplete: [
        { id: 101, name: 'Alice Johnson', email: 'alice.j@example.com' },
    ],
    portalAccessed: [
        { id: 102, name: 'Bob Williams', email: 'bob.w@example.com' },
    ],
    planPurchased: [
        { id: 103, name: 'Charlie Brown', email: 'charlie.b@example.com' },
    ],
    onboardingComplete: [
        { id: 104, name: 'Diana Miller', email: 'diana.m@example.com' },
    ],
    lettersGenerated: [
        { id: 105, name: 'Ethan Davis', email: 'ethan.d@example.com' },
    ],
    mailDelivered: [
        { id: 106, name: 'Fiona Garcia', email: 'fiona.g@example.com' },
    ],
};

// Define the columns based on the new stages for personal clients
const personalPipelineColumns = [
    { title: 'Analysis Complete', status: 'analysisComplete', data: personalPipelineData.analysisComplete, variant: 'secondary' as const },
    { title: 'Portal Accessed', status: 'portalAccessed', data: personalPipelineData.portalAccessed, variant: 'secondary' as const },
    { title: 'Plan Purchased', status: 'planPurchased', data: personalPipelineData.planPurchased, variant: 'secondary' as const },
    { title: 'Onboarding Complete', status: 'onboardingComplete', data: personalPipelineData.onboardingComplete, variant: 'secondary' as const },
    { title: 'Letters Generated', status: 'lettersGenerated', data: personalPipelineData.lettersGenerated, variant: 'secondary' as const },
    { title: 'Mail Delivered', status: 'mailDelivered', data: personalPipelineData.mailDelivered, variant: 'default' as const },
];

// Define the new stages for business clients (based on blueprint)
const businessPipelineData = {
    businessIntakeComplete: [
        { id: 201, name: 'Alpha Solutions', email: 'info@alpha.com' },
    ],
    unlockScoreScanComplete: [
        { id: 202, name: 'Beta Enterprises', email: 'contact@beta.net' },
    ],
    actionPlanDelivered: [
        { id: 203, name: 'Gamma Holdings', email: 'support@gamma.org' },
    ],
    vendorAccountsOpened: [
        { id: 204, name: 'Delta Logistics', email: 'ops@delta.biz' },
    ],
     fundingApplied: [
        { id: 205, name: 'Epsilon Ventures', email: 'investors@epsilon.co' },
    ],
     fundingApproved: [
        { id: 206, name: 'Zeta Innovations', email: 'ceo@zeta.inc' },
    ],
};

// Define the columns based on the new stages for business clients
const businessPipelineColumns = [
    { title: 'Business Intake Complete', status: 'businessIntakeComplete', data: businessPipelineData.businessIntakeComplete, variant: 'secondary' as const },
    { title: 'Unlock Score Scan Complete', status: 'unlockScoreScanComplete', data: businessPipelineData.unlockScoreScanComplete, variant: 'secondary' as const },
    { title: 'Action Plan Delivered', status: 'actionPlanDelivered', data: businessPipelineData.actionPlanDelivered, variant: 'secondary' as const },
    { title: 'Vendor Accounts Opened', status: 'vendorAccountsOpened', data: businessPipelineData.vendorAccountsOpened, variant: 'secondary' as const },
    { title: 'Funding Applied', status: 'fundingApplied', data: businessPipelineData.fundingApplied, variant: 'secondary' as const },
    { title: 'Funding Approved', status: 'fundingApproved', data: businessPipelineData.fundingApproved, variant: 'default' as const },
];


function ClientCard({ client }: { client: { name: string, email: string } }) {
    return (
        <Card className="mb-3 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-3 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${client.email}`} alt={client.name} />
                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm leading-tight">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function ClientPipeline() {
    return (
        <div className="space-y-8">
            {/* Personal Client Pipeline */}
            <div>
                <h3 className="text-lg font-headline font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Personal Client Pipeline</h3>
                 <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                        {personalPipelineColumns.map((column) => (
                            <div key={column.status} className="w-72 flex-shrink-0">
                                <div className="bg-muted rounded-t-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-sm">{column.title}</h4>
                                        <Badge variant={column.variant}>{column.data.length}</Badge>
                                    </div>
                                </div>
                                <div className="bg-secondary/50 rounded-b-lg p-2 h-96 overflow-y-auto">
                                    {column.data.length > 0 ? (
                                        column.data.map(client => (
                                            <ClientCard key={client.id} client={client} />
                                        ))
                                    ) : (
                                        <div className="text-center text-sm text-muted-foreground py-4">No clients in this stage.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            {/* Business Client Pipeline */}
            <div>
                 <h3 className="text-lg font-headline font-semibold mb-4 flex items-center gap-2"><Building className="w-5 h-5" /> Business Client Pipeline</h3>
                 <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                        {businessPipelineColumns.map((column) => (
                             <div key={column.status} className="w-72 flex-shrink-0">
                                <div className="bg-muted rounded-t-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-sm">{column.title}</h4>
                                        <Badge variant={column.variant}>{column.data.length}</Badge>
                                    </div>
                                </div>
                                <div className="bg-secondary/50 rounded-b-lg p-2 h-96 overflow-y-auto">
                                     {column.data.length > 0 ? (
                                        column.data.map(client => (
                                            <ClientCard key={client.id} client={client} />
                                        ))
                                    ) : (
                                        <div className="text-center text-sm text-muted-foreground py-4">No clients in this stage.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}
