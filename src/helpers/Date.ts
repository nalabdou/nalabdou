export const FrDate = (date: Date) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'Europe/paris' }).format(date);
