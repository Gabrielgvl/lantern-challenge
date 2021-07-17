import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";

interface GetTransactionsInput
  extends Pick<Prisma.TransactionFindManyArgs, "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ orderBy, skip = 0, take = 100 }: GetTransactionsInput, { session: { walletId } }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: transactions,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.transaction.count({ where: { walletId } }),
      query: (paginateArgs) =>
        db.transaction.findMany({
          ...paginateArgs,
          where: { walletId },
          orderBy,
          select: {
            id: true,
            amount: true,
            resultAmount: true,
            createdAt: true,
            type: true,
            from: { select: { symbol: true } },
            to: { select: { symbol: true } },
          },
        }),
    });

    return {
      transactions,
      nextPage,
      hasMore,
      count,
    };
  }
);
