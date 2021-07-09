import { resolver, NotFoundError } from "blitz";
import db from "db";
import { getTotal } from "integrations/fixerAPI";
import { z } from "zod";

const GetWalletTotal = z.object({
  id: z.string().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetWalletTotal), resolver.authorize(), async ({ id }) => {
  const wallet = await db.wallet.findFirst({
    where: { id },
    include: { defaultCurrency: true, amount: { include: { currency: true } } },
  });

  if (!wallet) throw new NotFoundError();

  const symbols = wallet.amount.map((w) => w.currency.symbol);

  return getTotal(wallet.defaultCurrency.symbol, symbols);
});
