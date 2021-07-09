import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const UpdateCurrency = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateCurrency),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const currency = await db.currency.update({ where: { id }, data });

    return currency;
  }
);
