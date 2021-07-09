import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetWallet = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetWallet), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const wallet = await db.wallet.findFirst({ where: { id } });

  if (!wallet) throw new NotFoundError();

  return wallet;
});
