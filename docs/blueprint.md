# **App Name**: UnlockScore AI

## Core Features:

- Landing Page: Professional landing page with lead capture form, testimonials, and affiliate referral tracking. Integrated with Firebase Hosting for optimal performance and scalability.
- User Authentication: User authentication and role-based access control (affiliate vs client) using Firebase Authentication. Clients onboard through an intake funnel with affiliate assignment tracking.
- Database Structure: Firestore database structured to store client, affiliate, payment, and letter data. Utilizes Firestore rules for secure data access.
- AI Letter Generation: AI-powered letter generation tool using Cloud Functions to generate personalized credit dispute letters. This tool validates file uploads, triggers the letter generation process, and stores secure download links in Firestore.
- Payment Processing: VIP tier pricing and payment processing integrated with Stripe and Firebase Extensions. Includes webhook functions for payment success and affiliate commission crediting.
- Affiliate Dashboard: Affiliate dashboard featuring real-time lead tracking, commissions earned, referral link generator, and performance analytics via Firebase Analytics. Deployed via Firebase Hosting with Firestore rules for secure access.
- Email Automation: Email automation for welcome emails, confirmation emails, upsell emails, and commission payout notices. This leverages Firebase Extensions and/or SendGrid API via Cloud Functions.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to evoke trust, authority, and intelligence, reflecting the AI-driven aspect of the platform and providing a professional feel.
- Background color: Very light blue (#E3F2FD), almost white, to offer a clean and uncluttered user interface, enhancing readability and trust.
- Accent color: A vibrant violet (#9C27B0), adding a touch of innovation and energy to the interface for interactive elements and calls to action.
- Headline font: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text; this communicates a modern and techy feel.
- Body font: 'Inter' (sans-serif) is paired with 'Space Grotesk' to improve readability for longer pieces of text.
- Use a consistent set of professional icons (line-style) related to finance, credit, and automation to enhance visual communication and user experience.
- Maintain a clean, responsive layout with clear sections, generous white space, and a mobile-first approach to ensure accessibility across all devices.