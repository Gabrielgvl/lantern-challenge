import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteCurrency = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(DeleteCurrency), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const currency = await db.currency.deleteMany({ where: { id } });

  return currency;
});
