import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteAmountWallet = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteAmountWallet),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const amountWallet = await db.amountWallet.deleteMany({ where: { id } });

    return amountWallet;
  }
);
