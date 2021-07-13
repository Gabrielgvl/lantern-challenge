import { Decimal } from "@prisma/client/runtime";
import to from "await-to-js";
import { resolver, NotFoundError } from "blitz";
import db from "db";
import { getTotal } from "integrations/currencyAPI";
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

  const symbols = new Map<string, Decimal>(wallet.amount.map((w) => [w.currency.symbol, w.amount]));

  const total = await getTotal(wallet.defaultCurrency.symbol, symbols);

  return {
    total: total,
    defaultCurrency: wallet.defaultCurrency,
  };
});
