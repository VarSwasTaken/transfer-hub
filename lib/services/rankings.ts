import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const MAX_LIMIT = 100;

function formatEuroMillions(value: number): string {
  const roundedMillions = Math.round(value / 1_000_000);
  return `${roundedMillions} mln €`;
}

// ==================== TOP PLAYERS ====================
type GetTopPlayersInput = {
  page: number;
  limit: number;
  position?: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
  leagueId?: number;
};

export type TopPlayerItem = {
  id: number;
  rank: number;
  firstName: string;
  lastName: string;
  position: string;
  marketValue: string;
  age: number;
  imageUrl: string | null;
  club: {
    id: number;
    name: string;
    logoUrl: string | null;
  } | null;
  league: {
    id: number;
    name: string;
    slug: string;
  } | null;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
};

type TopPlayersResult = {
  data: TopPlayerItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

const topPlayersInclude = {
  club: {
    include: {
      league: true,
    },
  },
  nationality: true,
} satisfies Prisma.PlayerInclude;

export async function getTopPlayers(input: GetTopPlayersInput): Promise<TopPlayersResult> {
  const { page, limit, position, leagueId } = input;
  const skip = (page - 1) * Math.min(limit, MAX_LIMIT);
  const take = Math.min(limit, MAX_LIMIT);

  const where: Prisma.PlayerWhereInput = {
    ...(position && { position }),
    ...(leagueId && { club: { leagueId } }),
  };

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      include: topPlayersInclude,
      orderBy: { marketValue: 'desc' },
      skip,
      take,
    }),
    prisma.player.count({ where }),
  ]);

  const startRank = skip + 1;
  const data = players.map((player, index) => ({
    id: player.id,
    rank: startRank + index,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    marketValue: formatEuroMillions(Number(player.marketValue)),
    age: new Date().getFullYear() - new Date(player.birthDate).getFullYear(),
    imageUrl: player.imageUrl,
    club: player.club
      ? {
          id: player.club.id,
          name: player.club.name,
          logoUrl: player.club.logoUrl,
        }
      : null,
    league: player.club?.league
      ? {
          id: player.club.league.id,
          name: player.club.league.name,
          slug: player.club.league.slug,
        }
      : null,
    nationality: player.nationality
      ? {
          id: player.nationality.id,
          name: player.nationality.name,
          flagUrl: player.nationality.flagUrl,
        }
      : null,
  }));

  return {
    data,
    meta: {
      page,
      limit: take,
      totalItems: total,
      totalPages: Math.ceil(total / take),
    },
  };
}

// ==================== CLUB VALUATIONS ====================
type GetClubValuationsInput = {
  page: number;
  limit: number;
  leagueId?: number;
};

export type ClubValuationItem = {
  id: number;
  rank: number;
  name: string;
  logoUrl: string | null;
  squadsValue: string;
  playerCount: number;
  avgPlayerValue: string;
  league: {
    id: number;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  };
};

type ClubValuationsResult = {
  data: ClubValuationItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export async function getClubValuations(input: GetClubValuationsInput): Promise<ClubValuationsResult> {
  const { page, limit, leagueId } = input;
  const skip = (page - 1) * Math.min(limit, MAX_LIMIT);
  const take = Math.min(limit, MAX_LIMIT);

  const where: Prisma.ClubWhereInput = {
    ...(leagueId && { leagueId }),
  };

  // Pobieramy wszystkie kluby (lub filtrowane po lidze), aby móc je posortować po wyliczonej wartości
  const allClubs = await prisma.club.findMany({
    where,
    include: {
      players: {
        select: {
          marketValue: true,
        },
      },
      league: {
        include: {
          nationality: true,
        },
      },
    },
  });

  const total = allClubs.length;

  // Obliczamy wartości i sortujemy
  const clubsWithValues = allClubs.map((club) => {
    const totalValue = club.players.reduce((sum, p) => sum + Number(p.marketValue), 0);
    const avgValue = club.players.length > 0 ? totalValue / club.players.length : 0;

    return {
      ...club,
      totalValueRaw: totalValue,
      avgValue,
      totalValueFormatted: formatEuroMillions(totalValue),
      avgValueFormatted: formatEuroMillions(avgValue),
    };
  });

  // Sortujemy malejąco po wartości rynkowej
  clubsWithValues.sort((a, b) => b.totalValueRaw - a.totalValueRaw);

  // Stronicujemy wynik
  const paginatedClubs = clubsWithValues.slice(skip, skip + take);

  const startRank = skip + 1;
  const data = paginatedClubs.map((club, index) => ({
    id: club.id,
    rank: startRank + index,
    name: club.name,
    logoUrl: club.logoUrl,
    squadsValue: club.totalValueFormatted,
    playerCount: club.players.length,
    avgPlayerValue: club.avgValueFormatted,
    league: {
      id: club.league.id,
      name: club.league.name,
      slug: club.league.slug,
      logoUrl: club.league.logoUrl,
    },
    nationality: {
      id: club.league.nationality.id,
      name: club.league.nationality.name,
      flagUrl: club.league.nationality.flagUrl,
    },
  }));

  return {
    data,
    meta: {
      page,
      limit: take,
      totalItems: total,
      totalPages: Math.ceil(total / take),
    },
  };
}

// ==================== PLAYER VALUATIONS ====================
type GetPlayerValuationsInput = {
  page: number;
  limit: number;
  search?: string;
  position?: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
  leagueId?: number;
  sortBy?: 'marketValue' | 'lastName' | 'age';
  sortOrder?: 'asc' | 'desc';
};

export type PlayerValuationItem = {
  id: number;
  rank: number;
  firstName: string;
  lastName: string;
  position: string;
  marketValue: string;
  age: number;
  imageUrl: string | null;
  club: {
    id: number;
    name: string;
    logoUrl: string | null;
  } | null;
  nationality: {
    id: number;
    name: string;
    flagUrl: string | null;
  } | null;
};

type PlayerValuationsResult = {
  data: PlayerValuationItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export async function getPlayerValuations(input: GetPlayerValuationsInput): Promise<PlayerValuationsResult> {
  const { page, limit, position, leagueId, sortBy = 'marketValue', sortOrder = 'desc' } = input;
  const skip = (page - 1) * Math.min(limit, MAX_LIMIT);
  const take = Math.min(limit, MAX_LIMIT);

  const where: Prisma.PlayerWhereInput = {
    ...(position && { position }),
    ...(leagueId && { club: { leagueId } }),
  };

  const [players, total] = await Promise.all([
    prisma.player.findMany({
      where,
      include: {
        club: true,
        nationality: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
    }),
    prisma.player.count({ where }),
  ]);

  const startRank = skip + 1;
  const data = players.map((player, index) => ({
    id: player.id,
    rank: startRank + index,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    marketValue: formatEuroMillions(Number(player.marketValue)),
    age: new Date().getFullYear() - new Date(player.birthDate).getFullYear(),
    imageUrl: player.imageUrl,
    club: player.club
      ? {
          id: player.club.id,
          name: player.club.name,
          logoUrl: player.club.logoUrl,
        }
      : null,
    nationality: player.nationality
      ? {
          id: player.nationality.id,
          name: player.nationality.name,
          flagUrl: player.nationality.flagUrl,
        }
      : null,
  }));

  return {
    data,
    meta: {
      page,
      limit: take,
      totalItems: total,
      totalPages: Math.ceil(total / take),
    },
  };
}
