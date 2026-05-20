import { getPlayersList } from '@/lib/services/players-list';
import { PlayersListView } from './players-list-view';

type PlayerListItem = {
  id: number;
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  marketValue: string;
  imageUrl: string | null;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
  club: {
    id: number;
    name: string;
    logoUrl: string | null;
    league: {
      id: number;
      name: string;
      slug: string;
    } | null;
  } | null;
};

export default async function PlayersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 50;
  const search = params.search?.trim();
  const position = params.position?.trim();
  const sortBy = (params.sortBy || 'lastName') as 'marketValue' | 'lastName' | 'createdAt';
  const sortOrder = (params.sortOrder || 'asc') as 'asc' | 'desc';

  const result = await getPlayersList({
    page,
    limit,
    search,
    position: position && position in { GOALKEEPER: 1, DEFENDER: 1, MIDFIELDER: 1, FORWARD: 1 } ? (position as any) : undefined,
    sortBy,
    sortOrder,
  });

  const players = result.data as PlayerListItem[];

  return <PlayersListView players={players} meta={result.meta} />;
}
