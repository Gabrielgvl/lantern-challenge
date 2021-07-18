import { integrateRatesAndCurrencies } from "integrations/currencyAPI";
import { CronJob } from "quirrel/blitz";

export default CronJob("api/retrieveRates", "@daily", integrateRatesAndCurrencies);
