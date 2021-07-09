import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const UpdateWallet = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateWallet),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const wallet = await db.wallet.update({ where: { id }, data });

    return wallet;
  }
);
