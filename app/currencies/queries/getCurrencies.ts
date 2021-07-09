import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";

interface GetCurrenciesInput
  extends Pick<Prisma.CurrencyFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCurrenciesInput) => {
    const {
      items: currencies,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.currency.count({ where }),
      query: (paginateArgs) => db.currency.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      currencies,
      nextPage,
      hasMore,
      count,
    };
  }
);
