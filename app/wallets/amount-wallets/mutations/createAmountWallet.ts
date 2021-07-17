import createTransaction from "app/transactions/mutations/createTransaction";
import { CreateAmountWallet } from "app/wallets/validations";
import { resolver } from "blitz";
import { TransactionType } from "db";
import createAmount from "./common/create";

export default resolver.pipe(
  resolver.zod(CreateAmountWallet),
  resolver.authorize(),
  async (input, ctx) => {
    const amount = await createAmount(input, ctx);

    createTransaction(
      {
        resultAmount: input.amount,
        toCurrencyId: input.currencyId,
        type: TransactionType.DEPOSIT,
      },
      ctx
    );

    return amount;
  }
);
