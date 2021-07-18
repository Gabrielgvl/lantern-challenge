import { Decimal } from "@prisma/client/runtime";
import to from "await-to-js";
import axios from "axios";
import db from "db";
import qs from "query-string";

const axiosInstance = axios.create({
  baseURL: process.env.CURRENCY_API_URL,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "comma" }),
  headers: {
    "x-rapidapi-key": process.env.CURRENCY_API_KEY,
    "x-rapidapi-host": process.env.CURRENCY_API_HOST,
  },
  validateStatus: (status) => status < 500,
});

interface SymbolsResponse {
  status: string;
  currencies: Record<string, string>;
  message?: string;
}

interface Rates {
  [key: string]: {
    currency_name: string;
    rate: string;
    rate_for_amount: string;
  };
}

interface RatesResponse {
  amount: string;
  base_currency_code: string;
  base_currency_name: string;
  rates: Rates;
  status: string;
  updated_date: string;
  message?: string;
}

export const getSymbols = async () => {
  const [err, response] = await to(axiosInstance.get<SymbolsResponse>("/list"));
  if (!response) {
    console.error(err);
    return null;
  }

  const { data } = response;

  if (data.status === "success") {
    return Object.entries(data.currencies).map(([symbol, description]) => ({
      symbol,
      description,
    }));
  }

  console.error(data.message);
  return null;
};

export const getRates = async () => {
  const [err, response] = await to(axiosInstance.get<RatesResponse>("/convert"));
  if (!response) {
    throw err;
  }

  const { data } = response;

  if (data.status === "success") {
    return Object.entries(data.rates).map(([symbol, rate]) => ({
      symbol,
      description: rate.currency_name,
      rate: new Decimal(rate.rate),
    }));
  }

  throw new Error(data.message);
};

export const integrateRatesAndCurrencies = async () => {
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
};
