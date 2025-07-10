'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building } from 'lucide-react';

// Personal Client Pipeline Data
const personalPipelineData = {
    onboarding: [
        { id: 1, name: 'Jane Doe', email: 'jane.d@example.com' },
    ],
    inReview: [
        { id: 2, name: 'John Smith', email: 'john.s@example.com' },
    ],
    completed: [
        { id: 3, name: 'Peter Jones', email: 'peter.j@example.com' },
        { id: 4, name: 'Mary Johnson', email: 'mary.j@example.com' },
    ]
};

const personalPipelineColumns = [
    { title: 'Onboarding', status: 'onboarding', data: personalPipelineData.onboarding, variant: 'secondary' as const },
    { title: 'In Review', status: 'inReview', data: personalPipelineData.inReview, variant: 'secondary' as const },
    { title: 'Completed', status: 'completed', data: personalPipelineData.completed, variant: 'default' as const },
];

// Business Client Pipeline Data
const businessPipelineData = {
    scanComplete: [
        { id: 1, name: 'Innovate Tech Corp', email: 'contact@innovate.com' },
    ],
    dashboardAccessed: [
        { id: 2, name: 'Main Street Cafe', email: 'owner@mainstreet.com' },
    ],
    scheduledAppointment: [
        { id: 3, name: 'Volunteer Express Logistics LLC', email: 'contact@volunteerexpress.com' },
    ],
    readyForFunding: [
        { id: 4, name: 'Global Solutions Inc', email: 'finance@globalsolutions.com' },
    ]
};

const businessPipelineColumns = [
    { title: 'Scan Complete', status: 'scanComplete', data: businessPipelineData.scanComplete, variant: 'secondary' as const },
    { title: 'Dashboard Accessed', status: 'dashboardAccessed', data: businessPipelineData.dashboardAccessed, variant: 'secondary' as const },
    { title: 'Scheduled Appointment', status: 'scheduledAppointment', data: businessPipelineData.scheduledAppointment, variant: 'outline' as const },
    { title: 'Ready for Funding', status: 'readyForFunding', data: businessPipelineData.readyForFunding, variant: 'default' as const },
];


function ClientCard({ client }: { client: { name: string, email: string } }) {
    return (
        <Card className="mb-2">
            <CardContent className="p-3">
                <p className="font-semibold text-sm">{client.name}</p>
                <p className="text-xs text-muted-foreground">{client.email}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {personalPipelineColumns.map((column) => (
                        <div key={column.status} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-sm">{column.title}</h3>
                                <Badge variant={column.variant}>{column.data.length}</Badge>
                            </div>
                            <div className="flex flex-col">
                                {column.data.map(client => (
                                    <ClientCard key={client.id} client={client} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Client Pipeline */}
            <div>
                 <h3 className="text-lg font-headline font-semibold mb-4 flex items-center gap-2"><Building className="w-5 h-5" /> Business Client Pipeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {businessPipelineColumns.map((column) => (
                        <div key={column.status} className="bg-muted/50 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-sm">{column.title}</h3>
                                <Badge variant={column.variant}>{column.data.length}</Badge>
                            </div>
                            <div className="flex flex-col">
                                {column.data.map(client => (
                                    <ClientCard key={client.id} client={client} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
