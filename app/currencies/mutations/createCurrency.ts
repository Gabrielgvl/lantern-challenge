import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const CreateCurrency = z.object({
  name: z.string(),
});

export default resolver.pipe(resolver.zod(CreateCurrency), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const currency = await db.currency.create({ data: input });

  return currency;
});
