import { resolver, NotFoundError } from "blitz";
import db from "db";
import { z } from "zod";

const GetCurrency = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetCurrency), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const currency = await db.currency.findFirst({ where: { id } });

  if (!currency) throw new NotFoundError();

  return currency;
});
