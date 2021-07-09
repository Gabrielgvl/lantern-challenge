import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";

interface GetAmountWalletsInput
  extends Pick<Prisma.AmountWalletFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAmountWalletsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: amountWallets,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.amountWallet.count({ where }),
      query: (paginateArgs) => db.amountWallet.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      amountWallets,
      nextPage,
      hasMore,
      count,
    };
  }
);
