import to from "await-to-js";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.FIXER_API_URL,
  params: { access_key: process.env.FIXER_API_KEY },
});

interface ApiError {
  code: number;
  info: string;
}

interface SymbolsResponse {
  success: boolean;
  symbols: Record<string, string>;
  error: ApiError;
}

interface LatestResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
  error: ApiError;
}

export const getSymbols = async () => {
  const { data } = await axiosInstance.get<SymbolsResponse>("/symbols");
  if (data.success) {
    return Object.entries(data.symbols).map(([symbol, description]) => ({
      symbol,
      description,
    }));
  }
  console.error(data.error.info);
  return null;
};

export const getTotal = async (base: string, symbols: string[]) => {
  const [err, response] = await to(
    axiosInstance.get<LatestResponse>("/latest", {
      params: { base, symbols },
    })
  );

  if (response?.data.success) {
    return Object.values(response.data.rates).reduce((total, val) => total + val, 0);
  }

  throw err || new Error(response?.data.error.info);
};
