import { Decimal } from "@prisma/client/runtime";
import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

const PreviewAmountWallet = z.object({
  amount: z.number(),
  fromCurrency: z.string(),
  toCurrency: z.string(),
});

export default resolver.pipe(
  resolver.zod(PreviewAmountWallet),
  resolver.authorize(),
  async ({ amount, fromCurrency, toCurrency }) => {
    const fromRate = await db.rate.findFirst({
      where: { currencySymbol: fromCurrency },
      orderBy: { createdAt: "desc" },
      select: { rate: true },
    });
    if (!fromRate) {
      throw new NotFoundError(`${fromRate} not found`);
    }

    const toRate = await db.rate.findFirst({
      where: { currencySymbol: toCurrency },
      orderBy: { createdAt: "desc" },
      select: { rate: true },
    });
    if (!fromRate || !toRate) {
      throw new NotFoundError(`${toRate} not found`);
    }

    return new Decimal(amount).dividedBy(fromRate.rate).times(toRate.rate).toNumber();
  }
);
