import PlayerValuation from '@/models/PlayerValuation';
import { connectToDatabase } from '@/lib/mongoose';

/**
 * Pobiera historyczne wyceny zawodnika z MongoDB.
 * Zwraca listę posortowaną malejąco (najnowsze najpierw).
 */
export async function getPlayerValuations(playerId: number) {
  await connectToDatabase();

  const docs = await PlayerValuation.find({ playerId }).sort({ year: -1, month: -1 }).limit(240).exec();

  return docs.map((doc) => ({
    year: doc.year,
    month: doc.month,
    value: doc.value,
    currency: doc.currency,
    createdAt: doc.createdAt?.toISOString() ?? null,
    updatedAt: doc.updatedAt?.toISOString() ?? null,
  }));
}

export default getPlayerValuations;
