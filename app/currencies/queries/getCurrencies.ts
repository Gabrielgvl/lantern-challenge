import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";

interface GetCurrenciesInput extends Pick<Prisma.CurrencyFindManyArgs, "skip" | "take"> {
  filter?: string;
}

export default resolver.pipe(async ({ filter, skip = 0, take = 100 }: GetCurrenciesInput) => {
  const where: Prisma.CurrencyWhereInput = {
    OR: [
      { symbol: { contains: filter, mode: "insensitive" } },
      { description: { contains: filter, mode: "insensitive" } },
    ],
  };
  console.debug(where);
  const {
    items: currencies,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () =>
      db.currency.count({
        where,
      }),
    query: (paginateArgs) =>
      db.currency.findMany({
        ...paginateArgs,
        where,
        orderBy: { symbol: "asc" },
      }),
  });

  return {
    currencies,
    nextPage,
    hasMore,
    count,
  };
});
