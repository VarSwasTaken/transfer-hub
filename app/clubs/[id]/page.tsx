import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ClubProfileView } from './club-profile-view';
import { getClubProfile } from '@/lib/services/club-profile';
import { normalizeLanguage } from '@/lib/i18n';

type ClubProfileData = {
  id: number;
  name: string;
  logoUrl: string | null;
  budget: string | null;
  league: {
    id: number;
    name: string;
    logoUrl: string | null;
    nationality: {
      id: number;
      name: string;
      namePL?: string | null;
      flagUrl: string | null;
    } | null;
  } | null;
  stats: {
    playerCount: number;
    totalMarketValue: string;
    avgMarketValue: string;
  };
  squadValueHistory?: Array<{ year: number; value: number }>;
  players: Array<{
    id: number;
    firstName: string;
    lastName: string;
    shirtNumber: number;
    position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
    marketValue: string | null;
    imageUrl?: string | null;
    nationality: {
      id: number;
      name: string;
      namePL?: string | null;
      flagUrl: string | null;
    } | null;
    agent: {
      id: number;
      name: string;
      agency: string;
    } | null;
  }>;
  transfersIn: Array<{
    id: number;
    player: {
      id: number;
      firstName: string;
      lastName: string;
      nationality: {
        id: number;
        name: string;
        namePL?: string | null;
        flagUrl: string | null;
      } | null;
    };
    fromClub: {
      id: number;
      name: string;
      logoUrl: string | null;
    } | null;
    fee: string | null;
    transferType: 'PERMANENT' | 'LOAN' | 'FREE';
    date: string;
  }>;
  transfersOut: Array<{
    id: number;
    player: {
      id: number;
      firstName: string;
      lastName: string;
      nationality: {
        id: number;
        name: string;
        namePL?: string | null;
        flagUrl: string | null;
      } | null;
    };
    toClub: {
      id: number;
      name: string;
      logoUrl: string | null;
    };
    fee: string | null;
    transferType: 'PERMANENT' | 'LOAN' | 'FREE';
    date: string;
  }>;
};

export default async function ClubProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clubId = Number(id);

  if (!Number.isInteger(clubId) || clubId <= 0) {
    notFound();
  }

  const profile = await getClubProfile(clubId);
  const club = profile.data as ClubProfileData | null;

  if (!club) {
    notFound();
  }

  const cookieStore = await cookies();
  const initialLanguage = normalizeLanguage(cookieStore.get('ui-language')?.value);

  return <ClubProfileView club={club} initialLanguage={initialLanguage} />;
}
