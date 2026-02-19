import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { player } = body;
        const { userId } = auth();

        // Security Check: If a real player ID is provided, it must match the active session.
        // Guest players (000000) are allowed without session matching.
        if (player !== '000000' && userId && player !== userId) {
            return NextResponse.json({ message: 'Unauthorized session mismatch' }, { status: 403 });
        }

        const savedGame = await GameService.saveGame(body);
        return NextResponse.json({ message: 'Game saved successfully', id: savedGame.id }, { status: 201 });
    } catch (error) {
        console.error('Error in savegame route:', error);
        return NextResponse.json({ message: 'Error saving game' }, { status: 500 });
    }
}
