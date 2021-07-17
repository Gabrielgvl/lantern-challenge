import db from "db";
import { z } from "zod";
import { CreateAmountWallet } from "app/wallets/validations";
import { AuthenticatedMiddlewareCtx } from "blitz";

const createAmount = async (
  input: z.infer<typeof CreateAmountWallet>,
  ctx: AuthenticatedMiddlewareCtx
) => {
  const {
    session: { walletId },
  } = ctx;
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
};

export default createAmount;
