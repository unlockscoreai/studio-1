
'use client';
import React, { forwardRef } from 'react';
import { format } from 'date-fns';

export type Bureau = 'Experian' | 'Equifax' | 'TransUnion';

const bureauAddresses: Record<Bureau, string> = {
    Experian: "Experian\nP.O. Box 4500\nAllen, TX 75013",
    Equifax: "Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374-0256",
    TransUnion: "TransUnion Consumer Solutions\nP.O. Box 2000\nChester, PA 19016-2000"
};

interface FormattedLetterProps {
    senderInfo: string;
    bureau: Bureau;
    body: string;
}

export const FormattedLetter = forwardRef<HTMLDivElement, FormattedLetterProps>(({ senderInfo, bureau, body }, ref) => {
    const todayDate = format(new Date(), "MMMM d, yyyy");
    const bureauAddress = bureauAddresses[bureau];

    return (
        <div ref={ref} className="p-10 bg-white text-black font-serif text-sm w-[8.5in]">
            <div className="mb-8 text-right">
                 <pre className="whitespace-pre-wrap font-serif text-sm">{senderInfo}</pre>
            </div>

            <p className="mb-8">{todayDate}</p>

            <div className="mb-8">
                 <pre className="whitespace-pre-wrap font-serif text-sm">{bureauAddress}</pre>
            </div>

            <p className="mb-4">Dear {bureau},</p>

            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">{body}</pre>
        </div>
    );
});

FormattedLetter.displayName = 'FormattedLetter';
