import { resolver } from "blitz";
import db, { TransactionType } from "db";
import { z } from "zod";

const CreateTransaction = z.object({
  amount: z.number().optional(),
  resultAmount: z.number(),
  fromCurrencyId: z.string().optional(),
  toCurrencyId: z.string(),
  type: z.nativeEnum(TransactionType),
});

export default resolver.pipe(
  resolver.zod(CreateTransaction),
  resolver.authorize(),
  async (input, { session: { walletId } }) => {
    const transaction = await db.transaction.create({
      data: { ...input, walletId },
    });

    return transaction;
  }
);
