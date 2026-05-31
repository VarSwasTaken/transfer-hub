export type Language = 'pl';

export function normalizeLanguage(_value: string | null | undefined): Language {
  return 'pl';
}

export function pickLocalizedName(languageOrValue: Language | { name: string; namePL?: string | null } | null | undefined, value?: { name: string; namePL?: string | null } | null | undefined): string {
  const normalizedValue = value ?? (languageOrValue as { name: string; namePL?: string | null } | null | undefined);
  if (!normalizedValue) return '';
  return normalizedValue.namePL?.trim() || normalizedValue.name;
}

const translations = {
  pl: {
    clubProfile: {
      positionGroups: {
        GOALKEEPER: 'Bramkarze',
        DEFENDER: 'Obrońcy',
        MIDFIELDER: 'Pomocnicy',
        FORWARD: 'Napastnicy',
      },
      country: 'Kraj',
      league: 'Liga',
      noCountry: 'Brak kraju',
      noLeague: 'Brak ligi',
      noData: 'Brak danych',
      budget: 'Budżet',
      squadValue: 'Wartość składu',
      founded: 'Założony',
      stadium: 'Stadion',
      squadPlayers: 'Zawodnicy składu',
      playersInClub: 'Brak zawodników w klubie',
      playersNone: 'Brak zawodników dla tej pozycji',
      positionLabels: {
        GOALKEEPER: 'BR',
        DEFENDER: 'OBR',
        MIDFIELDER: 'POM',
        FORWARD: 'N',
      },
      noNationality: 'Brak narodowości',
      incomingTransfers: 'Transfery do klubu',
      transferHistoryNone: 'Brak historii transferów',
      noClub: 'Brak klubu',
      outgoingTransfers: 'Transfery z klubu',
      rumours: 'Plotki transferowe',
      rumoursMissing: 'Brak danych o plotkach transferowych dla tego klubu w obecnym modelu bazy.',
      injuries: 'Kontuzjowani zawodnicy',
      injuriesMissing: 'Brak danych o kontuzjach klubowych w obecnym modelu bazy.',
      squadStats: 'Statystyki składu',
      playersCount: 'Liczba zawodników',
      averagePlayerValue: 'Średnia wartość zawodnika',
      chart: {
        title: 'Historia wartości składu',
        subtitle: 'Wartość w milionach EUR',
        series: 'Wartość składu',
        unit: 'mln €',
        deltaSuffix: 'vs zeszły rok',
      },
    },
    playerProfile: {
      marketValue: 'Wartość rynkowa',
      position: 'Pozycja',
      preferredFoot: 'Preferowana noga',
      age: 'Wiek',
      yearsOld: 'lat',
      height: 'Wzrost',
      weight: 'Waga',
      currentClub: 'Obecny klub',
      noClub: 'Brak klubu',
      nationality: 'Narodowość',
      noData: 'Brak danych',
      agent: 'Agent',
      born: 'Urodzony',
      contractUntil: 'Kontrakt do',
      transferHistory: 'Historia transferów',
      noTransferHistory: 'Brak historii transferów',
      loan: 'Wypożyczenie',
      noFromClub: 'Brak klubu',
      injuryHistory: 'Historia kontuzji',
      noInjuryHistory: 'Brak historii kontuzji',
      noReturnDate: 'Brak daty powrotu',
    },
    rankings: {
      topPlayers: 'Najdrożsi zawodnicy',
      topPlayersDesc: 'Zawodnicy rankingowani po wartości rynkowej',
      clubValuations: 'Najdroższe kluby',
      clubValuationsDesc: 'Kluby rankingowane po sumie wartości ich składów',
      playerValuations: 'Wyceny zawodników',
      playerValuationsDesc: 'Wszyscy zawodnicy rankingowani po wartości rynkowej',
      filters: 'Filtry',
      position: 'Pozycja',
      club: 'Klub',
      league: 'Liga',
      marketValue: 'Wartość rynkowa',
      player: 'Zawodnik',
      age: 'Wiek',
      squadsValue: 'Suma wartości',
      players: 'Zawodnicy',
      loading: 'Ładowanie...',
      noData: 'Brak danych',
      all: 'Wszystko',
      page: 'Strona',
      of: 'z',
      previous: 'Wstecz',
      next: 'Dalej',
    },
  },
} as const;

export function getTranslations(_language: Language = 'pl') {
  return translations.pl;
}
