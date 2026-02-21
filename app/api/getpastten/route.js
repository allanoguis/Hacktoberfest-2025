import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('playerId') || searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const pastTenGames = await GameService.getPastTenGames(userId);
        return NextResponse.json({ pastTenGames });
    } catch (error) {
        console.error('Error getting past ten games:', error);
        return NextResponse.json({ message: 'Error getting past ten games' }, { status: 500 });
    }
}
