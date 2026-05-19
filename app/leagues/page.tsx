import { getLeaguesList } from '@/lib/services/leagues-list';
import { LeaguesListView } from './leagues-list-view';

type LeagueListItem = {
  id: number;
  name: string;
  logoUrl: string | null;
  clubsCount: number;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  };
};

export default async function LeaguesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getLeaguesList({
    page,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const leagues = result.data as LeagueListItem[];

  return <LeaguesListView leagues={leagues} meta={result.meta} />;
}
