import { getFreeAgentsList } from '@/lib/services/free-agents-list';
import { PlayersListView } from '../players/players-list-view';

export default async function FreeAgentsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 50;
  const search = params.search?.trim();
  const sortBy = (params.sortBy || 'lastName') as 'marketValue' | 'lastName' | 'createdAt';
  const sortOrder = (params.sortOrder || 'asc') as 'asc' | 'desc';

  const result = await getFreeAgentsList({ page, limit, search, sortBy, sortOrder });

  const players = result.data;

  return <PlayersListView players={players as any} meta={result.meta} />;
}
