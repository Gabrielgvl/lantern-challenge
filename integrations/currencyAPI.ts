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

const convertValue = async (
  from: string,
  symbols: string[] | string,
  amount: number
): Promise<Rates> => {
  if (!symbols.length) {
    throw new Error("Must send at least one symbol");
  }
  const [err, response] = await to(
    axiosInstance.get<LatestResponse>("/convert", {
      params: { from, to: symbols, amount },
    })
  );

  if (!response) {
    throw err;
  }

  const { data } = response;

  if (data.status === "success") {
    return response.data.rates;
  }

  throw new Error(data.message);
};

export const getConvertedValue = async (
  from: string,
  symbol: string,
  amount: number
): Promise<number> => {
  const rates = await convertValue(from, symbol, amount);

  const convertedCurrency = rates[symbol];

  if (!convertedCurrency) {
    throw new Error("Failed to convert currency");
  }

  return parseFloat(convertedCurrency.rate);
};

export const getTotal = async (base: string, symbols: Map<string, Decimal>): Promise<number> => {
  if (!symbols.size) {
    return 0;
  }

  const rates = await convertValue(base, Array.from(symbols.keys()), 1);

  return Object.entries(rates).reduce(
    (total, [symbol, val]) => total + (symbols.get(symbol)?.toNumber() || 0) / parseFloat(val.rate),
    0
  );
};
