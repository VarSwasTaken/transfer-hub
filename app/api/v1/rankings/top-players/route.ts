import { NextRequest, NextResponse } from 'next/server';
import { getTopPlayers } from '@/lib/services/rankings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
    const position = searchParams.get('position') as any;
    const leagueId = searchParams.get('leagueId') ? parseInt(searchParams.get('leagueId')!, 10) : undefined;

    const result = await getTopPlayers({
      page,
      limit,
      position,
      leagueId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching top players:', error);
    return NextResponse.json({ error: 'Failed to fetch top players' }, { status: 500 });
  }
}
