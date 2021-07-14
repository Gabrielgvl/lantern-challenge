import { NotFoundError, resolver } from "blitz";
import db from "db";
import { getConvertedValue } from "integrations/currencyAPI";
import { z } from "zod";
import createAmountWallet from "./createAmountWallet";

const ExchangeAmountWallet = z.object({
  amountWalletId: z.string(),
  toCurrencyId: z.string(),
  exchangeAmount: z.number(),
});

export default resolver.pipe(
  resolver.zod(ExchangeAmountWallet),
  resolver.authorize(),
  async ({ amountWalletId, exchangeAmount, toCurrencyId }, ctx) => {
    const currentAmount = await db.amountWallet.findFirst({
      where: { id: amountWalletId },
      include: { currency: true },
    });

    if (!currentAmount) {
      throw new NotFoundError("Wallet Amount not found!");
    }

    await db.amountWallet.update({
      data: {
        amount: currentAmount.amount.minus(exchangeAmount),
      },
      where: { id: amountWalletId },
    });

    const toCurrency = await db.currency.findFirst({ where: { id: toCurrencyId } });

    if (!toCurrency) {
      throw new NotFoundError("Currency not found!");
    }

    const convertedAmount = await getConvertedValue(
      currentAmount.currency.symbol,
      toCurrency.symbol,
      exchangeAmount
    );

    return await createAmountWallet({ amount: convertedAmount, currencyId: toCurrencyId }, ctx);
  }
);
