import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const CreateAmountWallet = z.object({
  amount: z.number(),
  currencyId: z.string(),
  walletId: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateAmountWallet),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const amountWallet = await db.amountWallet.create({ data: input });

    return amountWallet;
  }
);