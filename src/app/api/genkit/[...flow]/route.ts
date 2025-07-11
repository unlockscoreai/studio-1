import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Genkit API temporarily disabled for deployment' });
}
