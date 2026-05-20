import { TransferType } from '@prisma/client';

import { prisma } from '@/lib/prisma';

type TransfersListInput = {
  page: number;
  limit: number;
  playerId?: number;
  playerName?: string;
  fromClubId?: number;
  toClubId?: number;
  transferType?: TransferType;
  windowStart?: string; // ISO date
  windowEnd?: string; // ISO date
};

type TransfersListItem = {
  id: number;
  playerId: number;
  playerName: string;
  playerImageUrl: string | null;
  playerPosition: string;
  playerNationalityFlag: string | null;
  playerNationalityName: string | null;
  fromClubId: number | null;
  fromClubName: string | null;
  fromClubLogoUrl: string | null;
  toClubId: number;
  toClubName: string;
  toClubLogoUrl: string | null;
  fee: string;
  transferType: TransferType;
  loanEndDate: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
};

type TransfersListResult = {
  data: TransfersListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getTransfersList(input: TransfersListInput): Promise<TransfersListResult> {
  const page = Math.max(1, input.page);
  const limit = Math.min(100, Math.max(1, input.limit));
  const skip = (page - 1) * limit;

  const where: any = {
    playerId: input.playerId,
    fromClubId: input.fromClubId,
    toClubId: input.toClubId,
    transferType: input.transferType,
  };

  if (input.windowStart || input.windowEnd) {
    where.date = {};
    if (input.windowStart) where.date.gte = new Date(input.windowStart);
    if (input.windowEnd) where.date.lte = new Date(input.windowEnd);
  }

  if (input.playerName) {
    // simple case-insensitive contains match on firstName or lastName
    where.player = {
      OR: [{ firstName: { contains: input.playerName, mode: 'insensitive' } }, { lastName: { contains: input.playerName, mode: 'insensitive' } }],
    };
  }

  const [items, total] = await prisma.$transaction([
    prisma.transfer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        player: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
            position: true,
            nationality: { select: { flagUrl: true, name: true } },
          },
        },
        fromClub: { select: { name: true, logoUrl: true } },
        toClub: { select: { name: true, logoUrl: true } },
      },
    }),
    prisma.transfer.count({ where }),
  ]);

  return {
    data: items.map((item) => ({
      id: item.id,
      playerId: item.playerId,
      playerName: `${item.player.firstName} ${item.player.lastName}`,
      playerImageUrl: item.player.imageUrl,
      playerPosition: item.player.position,
      playerNationalityFlag: item.player.nationality.flagUrl,
      playerNationalityName: item.player.nationality.name ?? null,
      fromClubId: item.fromClubId,
      fromClubName: item.fromClub?.name ?? null,
      fromClubLogoUrl: item.fromClub?.logoUrl ?? null,
      toClubId: item.toClubId,
      toClubName: item.toClub.name,
      toClubLogoUrl: item.toClub.logoUrl,
      fee: item.fee.toString(),
      transferType: item.transferType,
      loanEndDate: item.loanEndDate?.toISOString() ?? null,
      date: item.date.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}
