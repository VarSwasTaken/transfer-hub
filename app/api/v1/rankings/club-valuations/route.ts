import { NextRequest, NextResponse } from 'next/server';
import { getClubValuations } from '@/lib/services/rankings';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '20', 10));
    const leagueId = searchParams.get('leagueId') ? parseInt(searchParams.get('leagueId')!, 10) : undefined;

    const result = await getClubValuations({
      page,
      limit,
      leagueId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching club valuations:', error);
    return NextResponse.json({ error: 'Failed to fetch club valuations' }, { status: 500 });
  }
}
