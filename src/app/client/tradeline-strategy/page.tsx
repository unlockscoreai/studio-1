import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TradelineStrategyForm } from '@/components/client/tradeline-strategy-form';
import { Lightbulb } from 'lucide-react';

export default function TradelineStrategyPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    AI Tradeline Strategy Assistant
                </CardTitle>
                <CardDescription>
                    Answer a few questions about your credit profile and goals. Our AI will analyze your data and recommend high-impact primary tradelines to boost your Unlock Score™.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TradelineStrategyForm />
            </CardContent>
        </Card>
    );
}
