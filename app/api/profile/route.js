import { NextResponse } from 'next/server';
import { GameService } from '../../../lib/api-services';

export async function GET(request) {
    console.log('=== PROFILE API ROUTE CALLED ===');
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('Profile API: userId query:', userId);

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // For signed-in users, verify auth
    if (userId !== '000000') {
        try {
            const { auth } = await import('@clerk/nextjs/server');
            const { userId: authedUserId } = auth();
            
            console.log('Profile API: authedUserId:', authedUserId);
            
            if (!authedUserId) {
                console.log('Profile API: No authenticated user found');
                return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
            }
            
            if (userId !== authedUserId) {
                console.log('Profile API: Unauthorized - userId mismatch', { userId, authedUserId });
                return NextResponse.json({ message: 'Unauthorized profile access' }, { status: 403 });
            }
            
            // Auth successful, continue to profile data
        } catch (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({ message: 'Authentication error' }, { status: 500 });
        }
    }

    try {
        console.log('Profile API: Calling GameService.getProfileData with userId:', userId);
        const profileData = await GameService.getProfileData(userId);
        console.log('Profile API: GameService returned data:', profileData);
        return NextResponse.json(profileData);
    } catch (error) {
        console.error('=== PROFILE API ERROR ===');
        console.error('Full error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        console.error('Error name:', error?.name);
        console.error('Error code:', error?.code);
        return NextResponse.json({ 
            message: 'Error fetching profile data', 
            error: error?.message || 'Unknown error',
            stack: error?.stack 
        }, { status: 500 });
    }
}
