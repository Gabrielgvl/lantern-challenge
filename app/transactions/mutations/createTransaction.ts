import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const CreateTransaction = z.object({
  amount: z.number(),
  toCurrencyId: z.string(),
  fromCurrencyId: z.string(),
  walletId: z.string(),
  isDeposit: z.boolean(),
});

export default resolver.pipe(
  resolver.zod(CreateTransaction),
  resolver.authorize(),
  async (input) => {
    const transaction = await db.transaction.create({ data: input });

    return transaction;
  }
);
