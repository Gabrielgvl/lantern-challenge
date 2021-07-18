import db from "db";
import { integrateRatesAndCurrencies } from "integrations/currencyAPI";

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  const countCurrencies = await db.currency.count();
  if (countCurrencies === 0) {
    await integrateRatesAndCurrencies();
  }
};

export default seed;
