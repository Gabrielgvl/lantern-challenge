import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteWallet = z.object({
  id: z.string(),
});

export default resolver.pipe(resolver.zod(DeleteWallet), resolver.authorize(), async ({ id }) => {
  const wallet = await db.wallet.deleteMany({ where: { id } });

  return wallet;
});
