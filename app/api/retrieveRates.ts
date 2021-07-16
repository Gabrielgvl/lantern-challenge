import db from "db";
import { getRates, getSymbols } from "integrations/currencyAPI";
import { CronJob } from "quirrel/blitz";

export default CronJob("api/retrieveRates", "@hourly", async () => {
  const rates = await getRates();

  if (!rates) return;

  const currencyBatch = await db.currency.createMany({
    data: rates.map((r) => ({ symbol: r.symbol, description: r.description })),
    skipDuplicates: true,
  });

  const rateBatch = await db.rate.createMany({
    data: rates.map((r) => ({ rate: r.rate, currencySymbol: r.symbol })),
  });

  console.info(`Added ${currencyBatch.count} currencies`);
  console.info(`Added ${rateBatch.count} rates`);
});
