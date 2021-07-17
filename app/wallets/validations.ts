import { Currency } from "app/currencies/validations";
import { z } from "zod";

export const Deposit = z.object({
  amount: z.number(),
  currency: Currency,
});

export const WalletConfig = z.object({
  defaultCurrency: Currency,
});

export const Exchange = (max: number) =>
  z.object({
    toCurrency: Currency,
    exchangeAmount: z.number().max(max, "Insufficient Balance"),
  });

export const CreateAmountWallet = z.object({
  amount: z.number(),
  currencyId: z.string(),
});
