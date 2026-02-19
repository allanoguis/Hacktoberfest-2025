import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        const profileData = await GameService.getProfileData(userId);
        return NextResponse.json(profileData);
    } catch (error) {
        console.error('Error in profile route:', error);
        return NextResponse.json({ message: 'Error fetching profile data' }, { status: 500 });
    }
}
