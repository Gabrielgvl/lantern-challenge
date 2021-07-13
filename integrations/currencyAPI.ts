import { Decimal } from "@prisma/client/runtime";
import to from "await-to-js";
import axios from "axios";
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

interface LatestResponse {
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

export const getTotal = async (base: string, symbols: Map<string, Decimal>): Promise<number> => {
  return 0;
  if (!symbols.size) {
    return 0;
  }
  const [err, response] = await to(
    axiosInstance.get<LatestResponse>("/convert", {
      params: { from: base, to: Array.from(symbols.keys()), amount: 1 },
    })
  );

  if (!response) {
    throw err;
  }

  const { data } = response;

  if (data.status === "success") {
    return Object.entries(response.data.rates).reduce(
      (total, [symbol, val]) =>
        total + (symbols.get(symbol)?.toNumber() || 0) / parseFloat(val.rate),
      0
    );
  }

  throw new Error(data.message);
};
