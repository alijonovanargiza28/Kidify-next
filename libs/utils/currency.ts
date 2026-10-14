export const currencies = ['USD', 'KRW'] as const;
export type Currency = typeof currencies[number];
export const isCurrency = (value: any): value is Currency => currencies.includes(value);
// Existing database amounts are USD, confirmed by the project owner. Display preference never changes this.
export const canonicalCurrency: Currency = isCurrency(process.env.NEXT_PUBLIC_KIDIFY_CANONICAL_CURRENCY) ? process.env.NEXT_PUBLIC_KIDIFY_CANONICAL_CURRENCY : 'USD';
export type Rates = { base: Currency; rates: Record<Currency, number>; asOf: string; fetchedAt: number };
export const RATE_REFRESH_MS = 3600000;
export const RATE_MAX_AGE_MS = 7 * 86400000;
export function validRates(value: any, now = Date.now()): value is Rates {
 return !!value && isCurrency(value.base) && Number.isFinite(value.fetchedAt) && value.fetchedAt <= now + 60000 && typeof value.asOf === 'string' && Number.isFinite(Date.parse(value.asOf)) && currencies.every(c => Number.isFinite(value.rates?.[c]) && value.rates[c] > 0) && value.rates[value.base] === 1;
}
export function usableRates(value: any, now = Date.now()): value is Rates {
 return validRates(value, now) && now - value.fetchedAt <= RATE_MAX_AGE_MS && now - Date.parse(value.asOf) <= RATE_MAX_AGE_MS && Date.parse(value.asOf) - now <= 86400000;
}
export function freshRates(value: any, now = Date.now()): boolean {
 return usableRates(value,now) && now - value.fetchedAt < RATE_REFRESH_MS;
}
export function parseCentralBankRates(rows: any[], base: Currency, now = Date.now()): Rates {
 if (!Array.isArray(rows) || !isCurrency(base)) throw new Error('Invalid exchange-rate response');
 const quotes: Partial<Record<Currency, number>> = {};
 const dates: number[] = [];
 for (const currency of ['USD', 'KRW'] as const) {
  const row = rows.find(r => r?.Ccy === currency);
  const quote = Number(row?.Rate) / Number(row?.Nominal);
  const [day, month, year] = String(row?.Date).split('.').map(Number);
  const date = Date.UTC(year, month - 1, day);
  if (!Number.isFinite(quote) || quote <= 0 || !(Number(row?.Nominal)>0) || !Number.isFinite(date) || new Date(date).getUTCDate() !== day || new Date(date).getUTCMonth() !== month-1 || now - date > RATE_MAX_AGE_MS || date - now > 86400000) throw new Error('Invalid or stale exchange rates');
  quotes[currency] = quote; dates.push(date);
 }
 return { base, rates: Object.fromEntries(currencies.map(c => [c, quotes[base]! / quotes[c]!])) as Record<Currency,number>, asOf: new Date(Math.min(...dates)).toISOString().slice(0,10), fetchedAt: now };
}
export function displayPrice(amount: number, selected: Currency, rates: Rates | null, base: Currency = canonicalCurrency, now = Date.now()) {
 const usable = usableRates(rates,now) && rates.base === base;
 return { amount:(amount??0)*(usable ? rates.rates[selected] : 1), currency:usable ? selected : base };
}
export function formatCurrency(amount: number, currency: Currency, locale = 'en') {
 const numberLocale=locale === 'ko' ? 'ko-KR' : 'en-US';
 const digits=currency === 'KRW' ? 0 : 2;
 const formatted=new Intl.NumberFormat(numberLocale,{minimumFractionDigits:digits,maximumFractionDigits:digits}).format(amount);
 return `${currency === 'USD' ? '$' : '₩'}${formatted}`;
}
