import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetAmountWallet = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetAmountWallet),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const amountWallet = await db.amountWallet.findFirst({ where: { id } });

    if (!amountWallet) throw new NotFoundError();

    return amountWallet;
  }
);
