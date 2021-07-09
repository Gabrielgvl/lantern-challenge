import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteWallet = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(DeleteWallet), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wallet = await db.wallet.deleteMany({ where: { id } });

  return wallet;
});
