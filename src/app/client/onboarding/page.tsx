import { OnboardingForm } from '@/components/client/onboarding-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Complete Your Onboarding</CardTitle>
                <CardDescription>
                    Please provide the following information to secure your account and allow us to mail documents on your behalf.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <OnboardingForm />
            </CardContent>
        </Card>
    );
}
