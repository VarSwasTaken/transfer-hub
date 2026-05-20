import { Suspense } from 'react';

import PlayerValuationsPageClient from './page-client';

export default function PlayerValuationsPage() {
  return (
    <Suspense fallback={null}>
      <PlayerValuationsPageClient />
    </Suspense>
  );
}
