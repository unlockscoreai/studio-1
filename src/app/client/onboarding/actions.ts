'use server';

// This is a mock function. In a real application, you'd use an email service like Resend or Sendgrid.
export async function notifyAffiliate(affiliateId: string, clientName: string) {
    console.log('--- SIMULATING AFFILIATE NOTIFICATION ---');
    console.log(`Notifying affiliate ${affiliateId} that client ${clientName} has completed onboarding by uploading their ID and proof of mail.`);
    console.log('The first dispute letter is now ready for delivery.');
    console.log('--- SIMULATION COMPLETE ---');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, message: 'Affiliate has been notified.' };
}
