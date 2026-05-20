import { NextRequest, NextResponse } from 'next/server';
import { getPlayerValuations } from '@/lib/services/rankings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
    const position = searchParams.get('position') as any;
    const leagueId = searchParams.get('leagueId') ? parseInt(searchParams.get('leagueId')!, 10) : undefined;
    const sortBy = (searchParams.get('sortBy') || 'marketValue') as 'marketValue' | 'lastName' | 'age';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const result = await getPlayerValuations({
      page,
      limit,
      position,
      leagueId,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching player valuations:', error);
    return NextResponse.json({ error: 'Failed to fetch player valuations' }, { status: 500 });
  }
}
