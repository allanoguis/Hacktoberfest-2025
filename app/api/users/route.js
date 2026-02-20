import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId: bodyUserId } = body;
        const { userId: authedUserId } = auth();

        // Security Check: Only allow syncing if it's the Guest ID or the Authed User's ID
        if (bodyUserId !== '000000' && bodyUserId !== authedUserId) {
            return NextResponse.json({ message: 'Unauthorized profile sync' }, { status: 403 });
        }

        const result = await GameService.saveUser(body);
        return NextResponse.json(result, { status: result.message.includes('created') ? 201 : 200 });
    } catch (error) {
        console.error('Error in users route:', error);
        return NextResponse.json({ message: 'Error saving user' }, { status: 500 });
    }
}
