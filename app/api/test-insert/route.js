import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { player_name, score } = body;

        // Simple direct insert to test database functionality
        const { data, error } = await supabaseAdmin
            .from('games')
            .insert([
                {
                    user_id: '000000',
                    player_name: player_name,
                    score: score,
                    ip_address: '127.0.0.1',
                    device_type: 'Test',
                    user_agent: 'Test',
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Direct insert error:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: data?.[0] || null,
            message: 'Test score inserted successfully'
        });
    } catch (error) {
        console.error('Error in test insert:', error);
        return NextResponse.json({
            success: false,
            message: 'Error inserting test score',
            error: error.message
        }, { status: 500 });
    }
}
