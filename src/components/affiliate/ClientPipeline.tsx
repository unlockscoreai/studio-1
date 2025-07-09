'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const pipelineData = {
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

const pipelineColumns = [
    { title: 'Onboarding', status: 'onboarding', data: pipelineData.onboarding, variant: 'secondary' as const },
    { title: 'In Review', status: 'inReview', data: pipelineData.inReview, variant: 'secondary' as const },
    { title: 'Completed', status: 'completed', data: pipelineData.completed, variant: 'default' as const },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pipelineColumns.map((column) => (
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
    );
}
