import { notFound } from 'next/navigation';
import { PlayerProfileView } from './player-profile-view';
import { getPlayerProfile } from '@/lib/services/player-profile';

type PlayerProfileData = {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  shirtNumber: number;
  position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
  preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
  height: number | null;
  weight: number | null;
  marketValue: string | null;
  imageUrl: string | null;
  nationality: { id: number; name: string; namePL?: string | null; flagUrl: string | null } | null;
  club: { id: number; name: string; logoUrl?: string | null } | null;
  agent: { id: number; name: string } | null;
  contracts: Array<{ id: number; endDate: string }>;
  transfers: Array<{
    id: number;
    transferType: 'PERMANENT' | 'LOAN' | 'FREE';
    date: string;
    fee: string | null;
    fromClub: { id: number; name: string; logoUrl?: string | null } | null;
    toClub: { id: number; name: string; logoUrl?: string | null };
  }>;
  injuries: Array<{
    id: string;
    type: string;
    severity: 'Lekka' | 'Średnia' | 'Poważna' | 'Krytyczna';
    startDate: string;
    expectedReturnDate: string | null;
    actualReturnDate: string | null;
  }>;
  valuations: Array<{ year: number; month: number; value: number; currency?: string }>;
};

export default async function PlayerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const playerId = Number(id);

  if (!Number.isInteger(playerId) || playerId <= 0) {
    notFound();
  }

  const profile = await getPlayerProfile(playerId);
  const player = profile.data as PlayerProfileData | null;

  if (!player) {
    notFound();
  }

  return <PlayerProfileView player={player} />;
}
