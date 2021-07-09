import db from "db";
import { getSymbols } from "integrations/fixerAPI";
import { CronJob } from "quirrel/blitz";

export default CronJob("api/retrieveAll", "@daily", async () => {
  const symbols = await getSymbols();

  if (!symbols) return;

  const batch = await db.currency.createMany({ data: symbols, skipDuplicates: true });

  console.info(`Added ${batch.count} currencies`);
});
