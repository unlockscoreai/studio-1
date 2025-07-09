import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TradelineStrategyForm } from '@/components/dashboard/tradeline-strategy-form';
import { Lightbulb } from 'lucide-react';

export default function TradelineAssistantPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    AI Tradeline Strategy Assistant
                </CardTitle>
                <CardDescription>
                    Answer a few questions and our AI will generate a personalized tradeline strategy to help you build your credit profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TradelineStrategyForm />
            </CardContent>
        </Card>
    );
}
