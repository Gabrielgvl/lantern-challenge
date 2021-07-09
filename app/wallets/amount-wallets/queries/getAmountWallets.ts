import { paginate, resolver } from "blitz";
import db, { Prisma } from "db";
import { z } from "zod";

interface GetAmountWalletsInput
  extends Pick<Prisma.AmountWalletFindManyArgs, "orderBy" | "skip" | "take"> {
  walletId: string;
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ walletId, orderBy, skip = 0, take = 100 }: GetAmountWalletsInput) => {
    const where = { walletId };

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
