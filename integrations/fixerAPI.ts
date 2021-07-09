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
