import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWalletAmounts = z.object({
  id: z.string().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetWalletAmounts),
  resolver.authorize(),
  async ({ id }) => {
    const wallet = await db.wallet.findFirst({
      where: { id },
      include: { amount: { select: { id: true, currency: true, amount: true } } },
    });

    if (!wallet) throw new NotFoundError();

    return { ...wallet, amount: wallet.amount.map((a) => ({ ...a, amount: a.amount.toNumber() })) };
  }
);
