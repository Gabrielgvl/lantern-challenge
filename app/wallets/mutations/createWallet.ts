import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const CreateWallet = z.object({
  defaultCurrencyId: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateWallet),
  resolver.authorize(),
  async ({ defaultCurrencyId }, { session }) => {
    const wallet = await db.wallet.create({
      data: { currencyId: defaultCurrencyId, userId: session.userId },
    });

    return wallet;
  }
);
