import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { userId: authedUserId } = auth();

    console.log('Profile API: userId query:', userId, 'authedUserId:', authedUserId);

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Security Check: Ensure that the user is requesting their own profile
    if (userId !== '000000' && userId !== authedUserId) {
        console.log('Profile API: Unauthorized - userId mismatch', { userId, authedUserId });
        return NextResponse.json({ message: 'Unauthorized profile access' }, { status: 403 });
    }

    try {
        const profileData = await GameService.getProfileData(userId);
        console.log('Profile API returning data:', profileData);
        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error in profile route:', error);
        return NextResponse.json({ message: 'Error fetching profile data' }, { status: 500 });
    }
}
