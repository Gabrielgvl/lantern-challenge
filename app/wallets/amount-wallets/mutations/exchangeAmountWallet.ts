import createTransaction from "app/transactions/mutations/createTransaction";
import { NotFoundError, resolver } from "blitz";
import db, { TransactionType } from "db";
import { z } from "zod";
import getExchangePreviewAmount from "../queries/getConvertedAmount";
import createAmount from "./common/create";

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

    const resultAmount = await getExchangePreviewAmount(
      {
        fromCurrency: currentAmount.currency.symbol,
        toCurrency: toCurrency.symbol,
        amount: exchangeAmount,
      },
      ctx
    );

    createTransaction(
      {
        amount: exchangeAmount,
        resultAmount,
        fromCurrencyId: currentAmount.currencyId,
        toCurrencyId,
        type: TransactionType.EXCHANGE,
      },
      ctx
    );

    return await createAmount({ amount: resultAmount, currencyId: toCurrencyId }, ctx);
  }
);
