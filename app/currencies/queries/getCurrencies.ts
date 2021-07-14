import { resolver } from "blitz";
import db, { Prisma } from "db";

interface GetCurrenciesInput extends Pick<Prisma.CurrencyFindManyArgs, "skip" | "take"> {
  filter?: string;
}

export default resolver.pipe(async ({ filter }: GetCurrenciesInput) => {
  const currencies = await db.currency.findMany({
    orderBy: { symbol: "asc" },
  });

  return currencies;
});
