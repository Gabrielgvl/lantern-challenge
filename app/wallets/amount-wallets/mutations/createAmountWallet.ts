import to from "await-to-js";
import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const CreateAmountWallet = z.object({
  amount: z.number(),
  currencyId: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateAmountWallet),
  resolver.authorize(),
  async (input, { session: { walletId } }) => {
    const updatedWallet = await db.amountWallet.findFirst({
      where: { currencyId: input.currencyId, walletId },
      include: { currency: true },
    });

    if (!updatedWallet) {
      const newAmount = await db.amountWallet.create({
        data: { ...input, walletId },
        include: { currency: true },
      });
      return newAmount;
    }

    return await db.amountWallet.update({
      data: {
        amount: updatedWallet.amount.plus(input.amount),
      },
      where: { id: updatedWallet.id },
      include: { currency: true },
    });
  }
);
