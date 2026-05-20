import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

const MAX_LIMIT = 100;

type GetFreeAgentsInput = {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'marketValue' | 'lastName' | 'createdAt';
  sortOrder: 'asc' | 'desc';
};

type FreeAgentItem = {
  id: number;
  firstName: string;
  lastName: string;
  shirtNumber: number;
  position: string;
  marketValue: string;
  imageUrl: string | null;
  nationality: { id: number; name: string; flagUrl: string | null } | null;
  club: { id: number; name: string; logoUrl?: string | null; league?: { id: number; name: string; slug?: string } | null } | null;
};

type FreeAgentsResult = {
  data: FreeAgentItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

const playerInclude = {
  nationality: true,
  transfers: {
    orderBy: { date: 'desc' },
    take: 1,
    include: {
      fromClub: true,
      toClub: true,
    },
  },
} satisfies Prisma.PlayerInclude;

function toDecimalString(value: Prisma.Decimal): string {
  return value.toString();
}

export async function getFreeAgentsList(input: GetFreeAgentsInput): Promise<FreeAgentsResult> {
  const page = Math.max(1, input.page);
  const limit = Math.min(MAX_LIMIT, Math.max(1, input.limit));
  const skip = (page - 1) * limit;

  const where: Prisma.PlayerWhereInput = { clubId: null };

  const orderBy: Prisma.PlayerOrderByWithRelationInput = {
    [input.sortBy]: input.sortOrder,
  };

  const searchNormalized = input.search?.trim().toLowerCase() || '';

  let totalItems = 0;
  let players: any[] = [];

  if (!searchNormalized) {
    const [count, records] = await Promise.all([prisma.player.count({ where }), prisma.player.findMany({ where, skip, take: limit, orderBy, include: playerInclude })]);

    totalItems = count;
    players = records;
  } else {
    const allPlayers = await prisma.player.findMany({ where, orderBy, include: playerInclude });
    const filtered = allPlayers.filter((p) => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      return name.includes(searchNormalized) || p.firstName.toLowerCase().includes(searchNormalized) || p.lastName.toLowerCase().includes(searchNormalized);
    });

    totalItems = filtered.length;
    players = filtered.slice(skip, skip + limit);
  }

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    data: players.map((p) => {
      // determine last club from most recent transfer
      const lastTransfer = p.transfers && p.transfers.length > 0 ? p.transfers[0] : null;
      let lastClub = null;
      if (lastTransfer) {
        if (lastTransfer.fromClub) lastClub = lastTransfer.fromClub;
        else if (lastTransfer.toClub) lastClub = lastTransfer.toClub;
      }

      return {
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        shirtNumber: p.shirtNumber,
        position: p.position,
        marketValue: toDecimalString(p.marketValue),
        imageUrl: p.imageUrl,
        nationality: p.nationality ? { id: p.nationality.id, name: p.nationality.name, flagUrl: p.nationality.flagUrl } : null,
        club: lastClub
          ? {
              id: lastClub.id,
              name: lastClub.name,
              logoUrl: lastClub.logoUrl,
              league: lastClub.league ? { id: lastClub.league.id, name: lastClub.league.name, slug: lastClub.league.slug } : null,
            }
          : null,
      };
    }),
    meta: { page, limit, totalItems, totalPages },
  };
}
