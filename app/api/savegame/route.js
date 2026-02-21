import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';
import { auth } from '@clerk/nextjs/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { player, playerName, score, time, ipAddress, deviceType, userAgent } = body;
        const { userId } = auth();

        // Input validation
        if (!player || !playerName || score === undefined || time === undefined) {
            return NextResponse.json({ message: 'Missing required fields: player, playerName, score, time' }, { status: 400 });
        }

        if (typeof score !== 'number' || score < 0) {
            return NextResponse.json({ message: 'Score must be a non-negative number' }, { status: 400 });
        }

        if (typeof time !== 'number' || time < 0) {
            return NextResponse.json({ message: 'Time must be a non-negative number' }, { status: 400 });
        }

        // Security Check: If a real player ID is provided, it must match the active session.
        // Guest players (000000) are allowed without session matching.
        if (player !== '000000' && userId && player !== userId) {
            return NextResponse.json({ message: 'Unauthorized session mismatch' }, { status: 403 });
        }

        const savedGame = await GameService.saveGame(body);
        return NextResponse.json({ message: 'Game saved successfully', id: savedGame.id }, { status: 201 });
    } catch (error) {
        console.error('Error in savegame route:', {
            message: error?.message,
            code: error?.code,
            details: error?.details,
            hint: error?.hint,
            stack: error?.stack
        });
        return NextResponse.json(
            {
                message: `Error saving game: ${error?.message || 'Unknown error'}`,
                code: error?.code,
                details: error?.details,
                hint: error?.hint
            },
            { status: 500 }
        );
    }
}
