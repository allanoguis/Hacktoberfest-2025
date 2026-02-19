import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const leaderboard = await GameService.getLeaderboard();
        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error in leaderboard route:', error);
        return NextResponse.json({ message: 'Error retrieving leaderboard' }, { status: 500 });
    }
}
