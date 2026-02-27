import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Get raw data from the games table for Paolo
        const { data: rawGames, error: rawError } = await supabaseAdmin
            .from('games')
            .select('*')
            .eq('player_name', 'Paolo')
            .order('score', { ascending: false });

        if (rawError) throw rawError;

        // Get data from the leaderboard view for Paolo
        const { data: viewData, error: viewError } = await supabaseAdmin
            .from('leaderboard_view')
            .select('*')
            .eq('player_name', 'Paolo');

        if (viewError) throw viewError;

        return NextResponse.json({
            success: true,
            data: {
                raw_games: rawGames || [],
                leaderboard_view: viewData || [],
                raw_count: rawGames?.length || 0,
                view_count: viewData?.length || 0
            }
        });
    } catch (error) {
        console.error('Error in debug route:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error retrieving debug data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
