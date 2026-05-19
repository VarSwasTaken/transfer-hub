import { notFound } from 'next/navigation';
import { LeagueProfileView } from './league-profile-view';
import { getLeagueProfileBySlug } from '@/lib/services/league-profile';

export const fetchCache = 'force-no-store';

type LeagueProfileData = {
  id: number;
  name: string;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
  stats: {
    clubCount: number;
    playerCount: number;
    totalMarketValue: string;
    avgMarketValue: string;
  };
  clubs: Array<{
    id: number;
    name: string;
    logoUrl: string | null;
    budget: string | null;
    playerCount: number;
  }>;
};

export default async function LeagueProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const profile = await getLeagueProfileBySlug(slug);
  const league = profile.data as LeagueProfileData | null;

  if (!league) {
    notFound();
  }

  return <LeagueProfileView league={league} />;
}
