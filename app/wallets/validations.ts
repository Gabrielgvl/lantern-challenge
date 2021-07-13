import { Currency } from "app/currencies/validations";
import { z } from "zod";

export const Deposit = z.object({
  amount: z.number(),
  currency: Currency,
});
