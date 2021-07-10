import { resolver, NotFoundError } from "blitz";
import db from "db";

export default resolver.pipe(resolver.authorize(), async (_, { session: { userId } }) => {
  const wallet = await db.wallet.findFirst({
    where: { userId },
    include: { amount: true, defaultCurrency: true },
  });

  if (!wallet) throw new NotFoundError();

  return wallet;
});
