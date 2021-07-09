import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWallet = z.object({
  userId: z.string().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetWallet), resolver.authorize(), async ({ userId }) => {
  const wallet = await db.wallet.findFirst({
    where: { userId },
    include: { amount: true, defaultCurrency: true },
  });

  if (!wallet) throw new NotFoundError();

  return wallet;
});
