import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Get all recent games from the database
        const { data: allGames, error: allError } = await supabaseAdmin
            .from('games')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (allError) throw allError;

        return NextResponse.json({
            success: true,
            data: {
                all_games: allGames || [],
                count: allGames?.length || 0
            }
        });
    } catch (error) {
        console.error('Error in all games route:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error retrieving games data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
