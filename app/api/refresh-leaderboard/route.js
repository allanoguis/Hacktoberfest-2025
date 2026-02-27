import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Force refresh the materialized view if it exists
        try {
            await supabaseAdmin.rpc('refresh_leaderboard_view');
            console.log('Materialized view refreshed');
        } catch (refreshError) {
            console.log('No refresh function or view not materialized:', refreshError.message);
        }

        // Get fresh data from the leaderboard view
        const { data: viewData, error: viewError } = await supabaseAdmin
            .from('leaderboard_view')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);

        if (viewError) throw viewError;

        return NextResponse.json({
            success: true,
            data: {
                leaderboard: viewData || [],
                count: viewData?.length || 0
            }
        });
    } catch (error) {
        console.error('Error in refresh route:', error);
        return NextResponse.json({ 
            success: false,
            message: 'Error refreshing leaderboard',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
