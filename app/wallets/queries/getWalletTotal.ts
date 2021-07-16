import { Decimal } from "@prisma/client/runtime";
import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWalletTotal = z.object({
  id: z.string().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetWalletTotal), resolver.authorize(), async ({ id }) => {
  const wallet = await db.wallet.findFirst({
    where: { id },
    include: {
      defaultCurrency: {
        include: {
          Rate: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
      amount: {
        include: {
          currency: {
            select: {
              Rate: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const defaultRate = wallet?.defaultCurrency.Rate[0]?.rate;

  if (!wallet || !defaultRate) throw new NotFoundError();

  const total = wallet.amount.reduce(
    (total, amount) =>
      amount.amount
        .dividedBy(amount.currency.Rate[0]?.rate || 0)
        .times(defaultRate)
        .add(total),
    new Decimal(0)
  );

  const { Rate, ...defaultCurrency } = wallet.defaultCurrency;

  return {
    total: total.toNumber(),
    defaultCurrency: defaultCurrency,
  };
});
