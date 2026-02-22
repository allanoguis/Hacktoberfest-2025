import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');

    if (!playerId) {
        return NextResponse.json({ message: 'Player ID is required' }, { status: 400 });
    }

    try {
        const data = await GameService.getHighScore(playerId);

        if (!data) {
            return NextResponse.json({ message: 'No games found for the specified player' }, { status: 404 });
        }

        const topGame = {
            id: data.id,
            ...data,
            player: data.user_id,
            playerName: data.player_name,
            time: typeof data.time === 'string' ? (new Date(data.time).getTime() / 1000) : data.time,
            score: data.score
        };

        return NextResponse.json({ topGame });
    } catch (error) {
        console.error('Error retrieving high score:', error);
        return NextResponse.json({ message: 'Error retrieving high score for player' }, { status: 500 });
    }
}
