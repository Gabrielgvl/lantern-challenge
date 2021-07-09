import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const UpdateWallet = z.object({
  id: z.string(),
  currencyId: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateWallet),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const wallet = await db.wallet.update({ where: { id }, data });

    return wallet;
  }
);
