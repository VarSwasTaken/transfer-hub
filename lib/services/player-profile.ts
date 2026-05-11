import Injury from '@/models/Injury';
import PlayerValuation from '@/models/PlayerValuation';

import { connectToDatabase } from '@/lib/mongoose';
import { prisma } from '@/lib/prisma';

const PLAYER_CONTRACTS_LIMIT = 5;
const PLAYER_TRANSFERS_LIMIT = 20;
const NOSQL_TIMEOUT_MS = 700;

type PlayerProfileResult = {
  data: Record<string, unknown> | null;
  warnings: string[];
};

function decimalToString(value: { toString(): string } | null | undefined) {
  return value ? value.toString() : null;
}

export async function getPlayerProfile(playerId: number): Promise<PlayerProfileResult> {
  const warnings: string[] = [];

  const playerPromise = prisma.player.findUnique({
    where: { id: playerId },
    include: {
      nationality: true,
      club: {
        include: {
          league: {
            include: {
              nationality: true,
            },
          },
        },
      },
      agent: true,
      contracts: {
        orderBy: {
          endDate: 'desc',
        },
        take: PLAYER_CONTRACTS_LIMIT,
      },
      transfers: {
        orderBy: {
          date: 'desc',
        },
        take: PLAYER_TRANSFERS_LIMIT,
        include: {
          fromClub: true,
          toClub: true,
        },
      },
    },
  });

  const noSqlTask = (async () => {
    await connectToDatabase();

    const [injuryDocs, valuationDocs] = await Promise.all([Injury.find({ playerId }).sort({ startDate: -1 }).limit(10).exec(), PlayerValuation.find({ playerId }).sort({ year: -1, month: -1 }).limit(240).exec()]);

    const injuries = injuryDocs.map((doc) => {
      const injuryData = doc.toObject ? doc.toObject() : doc;
      return {
        id: doc.id,
        type_PL: doc.type_PL ?? ((injuryData as Record<string, unknown>).type as string) ?? 'Unknown',
        type_EN: doc.type_EN ?? ((injuryData as Record<string, unknown>).type as string) ?? 'Unknown',
        severity: doc.severity,
        status: doc.status,
        startDate: doc.startDate?.toISOString() ?? null,
        expectedReturnDate: doc.expectedReturnDate?.toISOString() ?? null,
        actualReturnDate: doc.actualReturnDate?.toISOString() ?? null,
        description_PL: doc.description_PL ?? null,
        description_EN: doc.description_EN ?? null,
        treatment_PL: doc.treatment_PL ?? null,
        treatment_EN: doc.treatment_EN ?? null,
        reportedBy: doc.reportedBy ?? null,
        createdAt: doc.createdAt?.toISOString() ?? null,
        updatedAt: doc.updatedAt?.toISOString() ?? null,
      };
    });

    const valuations = valuationDocs.map((doc) => ({
      year: doc.year,
      month: doc.month,
      value: doc.value,
      currency: doc.currency,
      createdAt: doc.createdAt?.toISOString() ?? null,
      updatedAt: doc.updatedAt?.toISOString() ?? null,
    }));

    return { injuries, valuations };
  })();

  const noSqlResult = (await Promise.race([noSqlTask.then((items) => ({ kind: 'ok' as const, items })), noSqlTask.catch((error) => ({ kind: 'error' as const, error })), new Promise<{ kind: 'timeout' }>((resolve) => setTimeout(() => resolve({ kind: 'timeout' }), NOSQL_TIMEOUT_MS))])) as { kind: 'ok'; items: { injuries: Array<Record<string, unknown>>; valuations: Array<Record<string, unknown>> } } | { kind: 'error'; error: unknown } | { kind: 'timeout' };

  const injuries: Array<Record<string, unknown>> = noSqlResult.kind === 'ok' ? noSqlResult.items.injuries : [];
  const valuations: Array<Record<string, unknown>> = noSqlResult.kind === 'ok' ? noSqlResult.items.valuations : [];

  if (noSqlResult.kind === 'timeout') {
    warnings.push('NoSQL data unavailable: request timed out.');
  } else if (noSqlResult.kind === 'error') {
    const message = noSqlResult.error instanceof Error ? noSqlResult.error.message : 'MongoDB is temporarily unavailable.';
    warnings.push(`NoSQL data unavailable: ${message}`);
  }

  const player = await playerPromise;

  if (!player) {
    return {
      data: null,
      warnings,
    };
  }

  const currentMarketValue = player.marketValue?.toNumber() ?? null;
  const resolvedValuations =
    valuations.length > 0 || currentMarketValue === null
      ? valuations
      : [
          {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            value: currentMarketValue,
            currency: 'EUR',
            createdAt: null,
            updatedAt: null,
          },
        ];

  return {
    data: {
      id: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      birthDate: player.birthDate.toISOString(),
      shirtNumber: player.shirtNumber,
      position: player.position,
      preferredFoot: player.preferredFoot,
      height: player.height,
      weight: player.weight,
      marketValue: decimalToString(player.marketValue),
      imageUrl: player.imageUrl,
      nationality: player.nationality
        ? {
            id: player.nationality.id,
            name: player.nationality.name,
            namePL: player.nationality.name_PL,
            flagUrl: player.nationality.flagUrl,
          }
        : null,
      club: player.club
        ? {
            id: player.club.id,
            name: player.club.name,
            logoUrl: player.club.logoUrl,
            budget: decimalToString(player.club.budget),
            league: player.club.league
              ? {
                  id: player.club.league.id,
                  name: player.club.league.name,
                  logoUrl: player.club.league.logoUrl,
                }
              : null,
          }
        : null,
      agent: player.agent
        ? {
            id: player.agent.id,
            name: player.agent.name,
            agency: player.agent.agency,
          }
        : null,
      contracts: player.contracts.map((contract) => ({
        id: contract.id,
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate.toISOString(),
        salary: decimalToString(contract.salary),
        releaseClause: decimalToString(contract.releaseClause),
      })),
      transfers: player.transfers.map((transfer) => ({
        date: transfer.date.toISOString(),
        transferType: transfer.transferType,
        fee: decimalToString(transfer.fee),
        fromClub: transfer.fromClub
          ? {
              id: transfer.fromClub.id,
              name: transfer.fromClub.name,
              logoUrl: transfer.fromClub.logoUrl,
            }
          : null,
        toClub: {
          id: transfer.toClub.id,
          name: transfer.toClub.name,
          logoUrl: transfer.toClub.logoUrl,
        },
      })),
      injuries,
      valuations: resolvedValuations,
    },
    warnings,
  };
}
