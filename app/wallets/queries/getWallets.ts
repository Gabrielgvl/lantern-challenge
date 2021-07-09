import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";

interface GetWalletsInput
  extends Pick<Prisma.WalletFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetWalletsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: wallets,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.wallet.count({ where }),
      query: (paginateArgs) => db.wallet.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      wallets,
      nextPage,
      hasMore,
      count,
    };
  }
);
