import { NextResponse } from 'next/server';
import { GameService } from '@/lib/api-services';

export async function POST(request) {
    try {
        const body = await request.json();
        const result = await GameService.saveUser(body);
        return NextResponse.json(result, { status: result.message.includes('created') ? 201 : 200 });
    } catch (error) {
        console.error('Error in users route:', error);
        return NextResponse.json({ message: 'Error saving user' }, { status: 500 });
    }
}
